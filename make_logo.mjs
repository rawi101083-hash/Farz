import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  console.log('Starting puppeteer...');
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 400, height: 400, deviceScaleFactor: 2 });
  await page.goto(`file://${path.join(__dirname, 'temp_logo.html')}`);
  
  console.log('Waiting for Tailwind to render...');
  await new Promise(r => setTimeout(r, 2000));
  
  const element = await page.$('.scale-up');
  
  if (!fs.existsSync('public')) {
    fs.mkdirSync('public');
  }
  
  console.log('Taking screenshot...');
  await element.screenshot({ path: 'public/logo.png', omitBackground: true });
  await browser.close();
  console.log('Logo saved successfully to public/logo.png!');
})();
