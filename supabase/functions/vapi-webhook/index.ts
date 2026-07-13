import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload = await req.json()
    console.log("Received Vapi Webhook Payload:", JSON.stringify(payload, null, 2))

    // Vapi wraps the event in a 'message' object
    const message = payload.message || payload

    // We only care about end-of-call-report where the recording is finalized
    if (message.type !== 'end-of-call-report') {
      return new Response(JSON.stringify({ status: 'ignored', reason: 'not end-of-call-report' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Helper function to recursively find a key in an object
    const findKey = (obj: any, key: string): any => {
      if (!obj || typeof obj !== 'object') return null;
      if (key in obj) return obj[key];
      for (const k in obj) {
        const result = findKey(obj[k], key);
        if (result) return result;
      }
      return null;
    }

    // Extract recording URL and basic fields
    const recordingUrl = findKey(message, 'recordingUrl') || message?.artifact?.recordingUrl || message?.call?.recordingUrl
    let transcript = findKey(message, 'transcript') || message?.artifact?.transcript || ''
    
    // Fallback: build transcript from messages array if the single string is missing
    if (!transcript) {
      const messages = findKey(message, 'messages') || message?.artifact?.messages || []
      if (Array.isArray(messages) && messages.length > 0) {
        transcript = messages
          .filter((m: any) => m.role === 'assistant' || m.role === 'user')
          .map((m: any) => `${m.role === 'assistant' ? 'المقيم الآلي' : 'المتقدم'}: ${m.message}`)
          .join('\n\n')
      }
    }
    
    // Extract structured data from Vapi's extraction block (handles nested UUIDs in Vapi's new format)
    const finalSummary = findKey(message, 'final_summary') || ''
    const extractedScore = findKey(message, 'score_out_of_10')
    const scoreOutOf10 = extractedScore !== undefined ? extractedScore : null

    // Extract applicantId (we passed it in variableValues)
    const applicantId = findKey(message, 'applicantId') || message?.call?.variableValues?.applicantId

    if (!applicantId) {
      console.error("Missing applicantId in payload!")
      return new Response(JSON.stringify({ error: 'Missing applicantId' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Initialize Supabase Admin Client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Extract ended reason
    const endedReason = message.endedReason || message.call?.endedReason || '';
    const isNetworkError = endedReason === 'customer-did-not-answer' || 
                           endedReason === 'customer-did-not-give-microphone-permission' || 
                           endedReason.includes('error');

    // ONLY REFUND IF IT WAS A NETWORK ERROR OR TIMEOUT (candidate never connected)
    if (isNetworkError) {
      console.log(`Call rejected for ${applicantId} due to ${endedReason}. Likely a timeout or network issue. Refunding credit...`)
      
      // Fetch applicant to get company_id for refund
      const { data: appData } = await supabase
        .from('applicants')
        .select('job_id, jobs ( company_id )')
        .eq('id', applicantId)
        .single()
        
      if (appData?.jobs?.company_id) {
        const companyId = appData.jobs.company_id
        // Refund credit manually
        const { data: company } = await supabase
          .from('companies')
          .select('used_interviews')
          .eq('id', companyId)
          .single()
          
        if (company && company.used_interviews > 0) {
          await supabase
            .from('companies')
            .update({ used_interviews: company.used_interviews - 1 })
            .eq('id', companyId)
          console.log(`Refunded 1 interview credit for company ${companyId}`)
        }
      }

      // Reset applicant status so they can retry
      await supabase
        .from('applicants')
        .update({ has_started_interview: false, is_interview_completed: false })
        .eq('id', applicantId)

      return new Response(JSON.stringify({ status: 'ignored', reason: `Call failed with reason: ${endedReason}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Update the applicant in the database
    const updateData: any = {
      is_interview_completed: true,
      has_started_interview: true
    }
    
    if (recordingUrl) {
      updateData.voice_eval = recordingUrl
    }
    if (transcript) {
      updateData.interview_transcript = transcript
    }
    if (finalSummary) {
      updateData.interview_summary = finalSummary
    }
    if (scoreOutOf10 !== null) {
      updateData.interview_score = Number(scoreOutOf10)
    }

    const { error } = await supabase
      .from('applicants')
      .update(updateData)
      .eq('id', applicantId)

    if (error) {
      console.error("Error updating database:", error)
      throw error
    }

    console.log(`Successfully updated applicant ${applicantId} with recording URL`)

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: any) {
    console.error("Webhook Error:", error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
