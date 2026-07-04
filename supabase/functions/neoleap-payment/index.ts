import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import crypto from "node:crypto";
import { Buffer } from "node:buffer";

// ==========================================
// 1. NeoLeap Configuration (Production Keys)
// ==========================================
const NEOLEAP_TERMINAL_ID = "PG409500";
const NEOLEAP_TRANPORTAL_ID = "2E39d6MJbgWEq5k";
const NEOLEAP_TRANPORTAL_PASSWORD = "!fMGIp!214rSN4c";
const NEOLEAP_RESOURCE_KEY = "60644970711260644970711260644970"; 
const NEOLEAP_API_URL = "https://digitalpayments.neoleap.com.sa/pg/payment/tranportal.htm"; 

// ==========================================
// 2. Encryption / Decryption Utilities
// ==========================================
// AES-256-CBC requires a 32-byte key and a 16-byte IV.
const ENCRYPTION_KEY = Buffer.from(NEOLEAP_RESOURCE_KEY, 'utf-8'); 
const IV = Buffer.alloc(16, 0); // 16 bytes of zeros (mathmatically correct for "32 zeros" in hex)

function encryptAES256(dataObj: any) {
  try {
    const jsonStr = JSON.stringify(dataObj);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
    let encrypted = cipher.update(jsonStr, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  } catch (error) {
    console.error("Encryption Error:", error);
    throw error;
  }
}

function decryptAES256(encryptedHex: string) {
  try {
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    decrypted = decrypted.replace(/\0+$/, ''); // Remove padding if any
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Decryption Error:", error);
    throw error;
  }
}

// ==========================================
// 3. Main Edge Function Handler
// ==========================================
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname; // e.g., /neoleap-payment/initiate or /neoleap-payment/callback
    
    // Initialize Supabase Client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // ==========================================
    // ROUTE: INITIATE PAYMENT
    // ==========================================
    // Check if the request is trying to initiate a payment
    const isInitiate = path.endsWith('/initiate') || url.searchParams.get('action') === 'initiate';
    if (isInitiate) {
      // It's a GET or POST, but let's handle POST
      if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
    }

    // Try parsing JSON if it's a POST
    let bodyJson: any = {};
    if (req.method === 'POST') {
      try {
        // Clone the request because it might be form data later in the callback
        if (req.headers.get("content-type")?.includes("application/json")) {
           bodyJson = await req.clone().json();
        }
      } catch (e) {
        // Ignore json parse error
      }
    }

    const isInitiatePost = isInitiate || bodyJson.action === 'initiate';

    if (isInitiatePost) {
      if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
      
      const { customerId, packageId, isYearly, returnUrl } = bodyJson;

      if (!customerId || !packageId) {
        return new Response(JSON.stringify({ error: 'Missing customerId or packageId' }), { 
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }

      // Fetch official price securely from the database
      const { data: planData } = await supabase.from('plans').select('price').eq('id', packageId).single();
      const amount = planData?.price;

      if (amount === undefined || amount === null) {
        return new Response(JSON.stringify({ error: 'Invalid Package ID or Price not configured' }), { 
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        });
      }

      // Formulate Webhook URL (Clean URL without query params for WAF)
      const callbackUrl = 'https://zpcooectdwokmvbgttsf.supabase.co/functions/v1/neoleap-payment';

      // Prepare payload for NeoLeap
      const payload = [{
        id: NEOLEAP_TRANPORTAL_ID,
        password: NEOLEAP_TRANPORTAL_PASSWORD,
        action: "1", // Purchase
        amt: amount.toString(),
        currencycode: "682", // SAR
        trackId: `${customerId}_${Date.now()}`,
        udf1: customerId, // Securely passing Customer ID
        udf2: packageId,  // Securely passing Package ID
        responseURL: callbackUrl,
        errorURL: callbackUrl,
        returnUrl: returnUrl || "https://your-domain.com/dashboard"
      }];

      const trandata = encryptAES256(payload);

      return new Response(JSON.stringify({
        paymentUrl: NEOLEAP_API_URL,
        id: NEOLEAP_TRANPORTAL_ID,
        trandata: trandata,
        errorURL: callbackUrl,
        responseURL: callbackUrl
      }), { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    }

    // ==========================================
    // ROUTE: CALLBACK WEBHOOK (NeoLeap to Supabase)
    // ==========================================
    if (req.method === 'POST' && !isInitiatePost) {
      // NeoLeap might send form data (application/x-www-form-urlencoded) or JSON.
      // Deno standard request body parsing:
      let bodyText = "";
      if (req.headers.get("content-type")?.includes("application/x-www-form-urlencoded")) {
        const formData = await req.formData();
        const trandata = formData.get("trandata")?.toString();
        const errorText = formData.get("ErrorText")?.toString();
        
        if (errorText && !trandata) {
          // Immediate failure from gateway
          return Response.redirect('https://your-domain.com/settings?payment=failed', 302);
        }

        if (!trandata) {
          return new Response('Missing trandata', { status: 400 });
        }

        const decryptedData = decryptAES256(trandata);
        const paymentResult = Array.isArray(decryptedData) ? decryptedData[0] : decryptedData;

        if (paymentResult.result === "CAPTURED" || paymentResult.result === "APPROVED") {
          const customerId = paymentResult.udf1;
          const planId = paymentResult.udf2;
          
          if (customerId) {
            // 1. Fetch exact package details from plans table
            const { data: planData, error: planError } = await supabase
              .from('plans')
              .select('cv_limit, jobs_limit, interviews_limit, duration_type, duration_value')
              .eq('id', planId)
              .single();

            // 2. Calculate exact expiration date based on duration
            const now = new Date();
            let endDate = new Date(now);
            
            if (planData && planData.duration_type && planData.duration_value) {
              const durType = planData.duration_type.toLowerCase();
              const durVal = parseInt(planData.duration_value);
              
              if (durType.includes('month')) {
                endDate.setMonth(now.getMonth() + durVal);
              } else if (durType.includes('year')) {
                endDate.setFullYear(now.getFullYear() + durVal);
              } else if (durType.includes('day')) {
                endDate.setDate(now.getDate() + durVal);
              } else {
                endDate.setMonth(now.getMonth() + 1); // fallback
              }
            } else {
              endDate.setMonth(now.getMonth() + 1); // fallback
            }

            // 3. Activate in Supabase
            const { error: updateErr } = await supabase
              .from('companies')
              .update({ 
                subscription_plan: planId,
                subscription_end_date: endDate.toISOString(),
                cv_limit: planData?.cv_limit ?? 50,
                jobs_limit: planData?.jobs_limit ?? 1,
                interviews_limit: planData?.interviews_limit ?? 1,
                used_cvs: 0,
                used_jobs: 0,
                used_interviews: 0
              })
              .eq('id', customerId);
              
            if (updateErr) console.error("CRITICAL Supabase Update Error:", updateErr);
          }
          return Response.redirect('https://your-domain.com/settings?payment=success', 302);
        } else {
          return Response.redirect(`https://your-domain.com/settings?payment=failed&reason=${paymentResult.result}`, 302);
        }

      } else {
        // Fallback for JSON body if NeoLeap sends JSON (less common for ACI)
        const jsonBody = await req.json();
        const decryptedData = decryptAES256(jsonBody.trandata);
        const paymentResult = Array.isArray(decryptedData) ? decryptedData[0] : decryptedData;
        
        // Similar logic...
        if (paymentResult.result === "CAPTURED" || paymentResult.result === "APPROVED") {
           const customerId = paymentResult.udf1;
           const planId = paymentResult.udf2;
           if (customerId) {
             // 1. Fetch exact package details from plans table
             const { data: planData } = await supabase
               .from('plans')
               .select('cv_limit, jobs_limit, interviews_limit, duration_type, duration_value')
               .eq('id', planId)
               .single();

             // 2. Calculate exact expiration date based on duration
             const now = new Date();
             let endDate = new Date(now);
             
             if (planData && planData.duration_type && planData.duration_value) {
               const durType = planData.duration_type.toLowerCase();
               const durVal = parseInt(planData.duration_value);
               
               if (durType.includes('month')) {
                 endDate.setMonth(now.getMonth() + durVal);
               } else if (durType.includes('year')) {
                 endDate.setFullYear(now.getFullYear() + durVal);
               } else if (durType.includes('day')) {
                 endDate.setDate(now.getDate() + durVal);
               } else {
                 endDate.setMonth(now.getMonth() + 1); // fallback
               }
             } else {
               endDate.setMonth(now.getMonth() + 1); // fallback
             }

             // 3. Activate in Supabase
             const { error: updateErr } = await supabase.from('companies').update({ 
               subscription_plan: planId,
               cv_limit: planData?.cv_limit ?? 50,
               jobs_limit: planData?.jobs_limit ?? 1,
               interviews_limit: planData?.interviews_limit ?? 1,
               used_cvs: 0,
               used_jobs: 0,
               used_interviews: 0,
               subscription_end_date: endDate.toISOString()
             }).eq('id', customerId);

             if (updateErr) {
               console.error("CRITICAL SUPABASE UPDATE ERROR:", updateErr);
               return new Response(JSON.stringify({ error: updateErr }), { status: 500 });
             }
           }
           
           return new Response('Success', { status: 200 });
        }
        return new Response('Failed', { status: 400 });
      }
    }

    // Default 404
    return new Response('Endpoint not found', { status: 404, headers: corsHeaders });

  } catch (error: any) {
    console.error("Server Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    });
  }
});
