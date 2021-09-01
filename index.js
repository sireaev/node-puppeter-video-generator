const puppeteer = require('puppeteer');
let counter = 1;
const assertFrames = async (counter) => {
  const divFrame = document.createElement('span');
  const input = document.querySelector('input[type="text"]')
  input.value += 'Pro'

  divFrame.setAttribute('style', 'position: absolute; top: 280px; left: 280px');
  divFrame.innerHTML = counter;
  await body.appendChild(divFrame);
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://google.com');
  const bodyHandle = await page.$('body');
  
  await page.evaluate((body) => {
    
    assertFrames(1);
    return Promise.resolve(body)}, bodyHandle);

  await page.screenshot({ path: './assets/example1.png', clip: { x: 0, y: 0, height: 300, width: 300 } });

  counter++;

  await page.evaluate((body) => {
      
    const input = document.querySelector('input[type="text"]')
    input.value += 'duct'
  });

  await page.screenshot({ path: './assets/example2.png', clip: { x: 0, y: 0, height: 300, width: 300 } });

  counter++;

  await browser.close();
})();
