require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
// Parse URL-encoded bodies (as sent by payment gateways in callbacks) and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ==========================================
// 1. NeoLeap Configuration (Production Keys)
// ==========================================
const NEOLEAP_TERMINAL_ID = "PG409500";
const NEOLEAP_TRANPORTAL_ID = "2E39d6MJbgWEq5k";
const NEOLEAP_TRANPORTAL_PASSWORD = "!fMGIp!214rSN4c";
const NEOLEAP_RESOURCE_KEY = "60644970711260644970711260644970"; 
// Standard NeoLeap/Tranportal API Endpoint
const NEOLEAP_API_URL = "https://digitalpayments.neoleap.com.sa/CGW/hosted.htm"; 

// ==========================================
// 2. Supabase Configuration
// ==========================================
const supabaseUrl = process.env.VITE_SUPABASE_URL || "YOUR_SUPABASE_URL";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "YOUR_SUPABASE_SERVICE_KEY";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ==========================================
// 3. Encryption / Decryption Utilities
// ==========================================
// Tranportal usually requires AES-256-CBC. Key is 32 bytes.
const ENCRYPTION_KEY = Buffer.from(NEOLEAP_RESOURCE_KEY, 'utf-8'); 
// Some Tranportal gateways use a fixed IV, others use the Tranportal ID padded. 
// Standard ACI/Tranportal often uses an empty IV (all zeros) for AES-256-CBC.
const IV = Buffer.alloc(16, 0); 

function encryptAES256(dataObj) {
  try {
    const jsonStr = JSON.stringify(dataObj);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
    // Usually no padding in some old systems, but standard is PKCS7 (which Node uses by default)
    let encrypted = cipher.update(jsonStr, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  } catch (error) {
    console.error("Encryption Error:", error);
    throw error;
  }
}

function decryptAES256(encryptedHex) {
  try {
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
    // Suppress auto-padding if the gateway uses custom padding (optional, usually not needed)
    // decipher.setAutoPadding(false);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    // Remove null characters or padding if any
    decrypted = decrypted.replace(/\0+$/, '');
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Decryption Error:", error);
    throw error;
  }
}

// ==========================================
// 4. Initiate Payment (Dynamic Session)
// ==========================================
app.post('/api/payment/initiate', async (req, res) => {
  try {
    const { customerId, planId, amount, returnUrl } = req.body;

    if (!customerId || !amount) {
      return res.status(400).json({ error: 'Missing customerId or amount' });
    }

    // Prepare the payload for NeoLeap
    const payload = [{
      id: NEOLEAP_TRANPORTAL_ID,
      password: NEOLEAP_TRANPORTAL_PASSWORD,
      action: "1", // 1 = Purchase
      amt: amount.toString(),
      currencycode: "682", // 682 is SAR (Saudi Riyal)
      trackId: `${customerId}_${Date.now()}`, // Unique tracking ID containing customer ID
      udf1: customerId, // Passing Customer_ID in User Defined Field 1
      udf2: planId || "default_plan", // Optional: Pass plan ID
      responseURL: `${req.protocol}://${req.get('host')}/api/payment/callback`, // The Webhook URL
      errorURL: `${req.protocol}://${req.get('host')}/api/payment/callback`,
      // Return URL to redirect user back to your site after payment
      returnUrl: returnUrl || "https://your-frontend-domain.com/dashboard" 
    }];

    // Encrypt the payload
    const trandata = encryptAES256(payload);

    // Formulate the request to NeoLeap
    // Typically, we return the trandata and URL to the frontend so it can submit a form to NeoLeap,
    // or we redirect the user directly.
    return res.json({
      paymentUrl: NEOLEAP_API_URL,
      id: NEOLEAP_TRANPORTAL_ID,
      trandata: trandata,
      errorURL: `${req.protocol}://${req.get('host')}/api/payment/callback`,
      responseURL: `${req.protocol}://${req.get('host')}/api/payment/callback`
    });

  } catch (err) {
    console.error("Error initiating payment:", err);
    res.status(500).json({ error: 'Failed to initiate payment session' });
  }
});

// ==========================================
// 5. Webhook / Callback Endpoint
// ==========================================
app.post('/api/payment/callback', async (req, res) => {
  console.log("Received Webhook from NeoLeap:", req.body);
  
  try {
    const { trandata, ErrorText } = req.body;

    if (ErrorText && !trandata) {
      console.error("Payment Failed directly from gateway:", ErrorText);
      return res.redirect('https://your-frontend-domain.com/settings?payment=failed');
    }

    if (!trandata) {
      return res.status(400).send("No trandata received");
    }

    // 1. Decrypt the response
    const decryptedData = decryptAES256(trandata);
    console.log("Decrypted Payment Data:", decryptedData);

    /* 
      Expected decrypted response usually looks like:
      [{
        "result": "CAPTURED", // or "APPROVED"
        "auth": "123456",
        "ref": "987654321",
        "tranid": "1234567890",
        "postdate": "0513",
        "trackId": "customer123_1620000000000",
        "udf1": "customer123", // The customer ID we sent
        "udf2": "growth_monthly"
      }]
    */
    const paymentResult = Array.isArray(decryptedData) ? decryptedData[0] : decryptedData;

    // 2. Check if payment is successful
    if (paymentResult.result === "CAPTURED" || paymentResult.result === "APPROVED") {
      const customerId = paymentResult.udf1;
      const planId = paymentResult.udf2;
      
      console.log(`Payment successful for Customer: ${customerId}. Activating plan: ${planId}`);

      // 3. Update Supabase
      if (customerId) {
        const { data, error } = await supabase
          .from('companies') // <-- غير اسم الجدول هنا حسب قاعدة بياناتك (مثلا users أو profiles أو companies)
          .update({ 
            subscription_status: 'Active',
            subscription_plan: planId,
            payment_transaction_id: paymentResult.tranid,
            subscription_end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString() // إضافة شهر
          })
          .eq('id', customerId);

        if (error) {
          console.error("Error updating Supabase:", error);
        } else {
          console.log("Supabase updated successfully.");
        }
      }
      
      // 4. Redirect user to Success Page
      return res.redirect('https://your-frontend-domain.com/settings?payment=success');
    } else {
      console.log("Payment not approved. Result:", paymentResult.result);
      // Redirect to Failure Page
      return res.redirect(`https://your-frontend-domain.com/settings?payment=failed&reason=${paymentResult.result}`);
    }

  } catch (err) {
    console.error("Error processing callback:", err);
    return res.redirect('https://your-frontend-domain.com/settings?payment=error');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`NeoLeap Backend listening on port ${PORT}`);
  console.log(`Webhook Callback URL will be: http://<your-server-ip-or-domain>:${PORT}/api/payment/callback`);
});
