import crypto from "crypto";

// === 1. Configuration ===
const NEOLEAP_RESOURCE_KEY = "60644970711260644970711260644970"; 
const ENCRYPTION_KEY = Buffer.from(NEOLEAP_RESOURCE_KEY, 'utf-8'); 
const IV = Buffer.alloc(16, 0);
const WEBHOOK_URL = "https://zpcooectdwokmvbgttsf.supabase.co/functions/v1/neoleap-payment";

// === 2. Target Customer & Package ===
const CUSTOMER_ID = "4b531542-0dea-45c9-a831-cdcb1f342102";
const PACKAGE_ID = "business_yearly"; // Business Yearly package

// === 3. Encryption Function ===
function encryptAES256(dataObj) {
  const jsonStr = JSON.stringify(dataObj);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
  let encrypted = cipher.update(jsonStr, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// === 4. Simulation Function ===
async function runSimulation() {
  console.log("🚀 Starting Real Payment Simulation...");
  console.log(`👤 Target Customer: ${CUSTOMER_ID}`);
  console.log(`📦 Target Package: ${PACKAGE_ID}`);

  // Construct the exact payload NeoLeap sends upon successful payment
  const payload = [{
    result: "CAPTURED",
    udf1: CUSTOMER_ID,
    udf2: PACKAGE_ID,
    tranid: `SIM_${Date.now()}`
  }];

  const trandata = encryptAES256(payload);
  console.log(`🔐 Encrypted Bank Payload Generated.`);

  console.log(`🌐 Sending POST Request to Supabase Edge Function...`);
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ trandata })
    });

    if (response.ok) {
      console.log(`✅ Webhook Executed Successfully! (Status: ${response.status})`);
      console.log("\n🎉 The Edge Function has processed the payment!");
      console.log("👉 Please go to your Supabase Dashboard -> Table: companies");
      console.log(`👉 Search for ID: ${CUSTOMER_ID}`);
      console.log("👉 Verify the following:");
      console.log("   1. subscription_status = 'Active'");
      console.log("   2. subscription_plan = 'single_job'");
      console.log("   3. jobs_limit = 1");
      console.log("   4. cv_limit = 500");
      console.log("   5. interviews_limit = 1");
      console.log("   6. subscription_end_date = [Exactly 45 days from now!]");
    } else {
      console.error(`❌ Webhook Failed with Status: ${response.status}`);
      const text = await response.text();
      console.error(`Error Details: ${text}`);
    }
  } catch (error) {
    console.error(`❌ Network Error:`, error.message);
  }
}

runSimulation();
