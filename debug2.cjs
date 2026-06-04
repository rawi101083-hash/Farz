const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  // We need to click the create job button. It's usually labeled "إنشاء وظيفة"
  try {
    console.log("Looking for button");
    const [button] = await page.$x("//button[contains(., 'إنشاء وظيفة') or contains(., 'إضافة وظيفة')]");
    if (button) {
      console.log("Button found, clicking");
      await button.click();
      await new Promise(r => setTimeout(r, 2000));
    } else {
      console.log("Button not found. Trying to find any button with 'وظيفة'");
      const [button2] = await page.$x("//*[contains(text(), 'وظيفة')]");
      if (button2) {
          console.log("Found something with وظيفة");
          await button2.click();
          await new Promise(r => setTimeout(r, 2000));
      }
    }
  } catch(e) {
    console.log("Error clicking:", e.message);
  }

  await browser.close();
})();
