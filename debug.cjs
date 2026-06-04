const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err.toString()));
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  // Try to navigate to create job if it's an SPA
  // We don't know the exact route, maybe /create or we just click the button
  await browser.close();
})();
