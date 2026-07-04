import crypto from "crypto";
import fetch from "node-fetch";

const NEOLEAP_RESOURCE_KEY = "60644970711260644970711260644970"; 
const ENCRYPTION_KEY = Buffer.from(NEOLEAP_RESOURCE_KEY, 'utf-8'); 
const IV = Buffer.alloc(16, 0);

function encryptAES256(dataObj) {
  const jsonStr = JSON.stringify(dataObj);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, IV);
  let encrypted = cipher.update(jsonStr, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

async function runSimulation() {
  console.log("🚀 Starting Payment Simulation...");

  // Since we don't have the Service Key, we will tell the user to create a dummy user
  // OR we just use a known dummy ID if we have one. Let's just use a fake UUID and see if the webhook returns 200.
  // Wait, if we use a fake UUID, the webhook might fail to update the DB, but we won't be able to verify it.
  
  // Let's just create a raw SQL script for him to run that creates a company, then we give him the trandata to test, or we tell him to use his own account!
}

runSimulation();
