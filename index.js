const puppeteer = require('puppeteer');
const { spawn } = require('child_process');


(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://google.com');
  const bodyHandle = await page.$('body');
  let screenPusher;
  let screenArray = [];

  await page.evaluate((body) => {
    const divFrame = document.createElement('span');
    const input = document.querySelector('input[type="text"]')
    input.value += '';

    divFrame.setAttribute('style', 'position: absolute; top: 280px; left: 280px');
    divFrame.innerHTML = 1;
    body.appendChild(divFrame);
    return Promise.resolve(body)
  }, bodyHandle);

  screenPusher = await page.screenshot({ path: './assets/example.png', clip: { x: 0, y: 0, height: 300, width: 300 }});
  screenArray.push(screenPusher);

  await page.evaluate((body) => {
    const divFrame = document.createElement('span');
    const input = document.querySelector('input[type="text"]')
    input.value += 'Pro';

    divFrame.setAttribute('style', 'position: absolute; top: 280px; left: 280px');
    divFrame.innerHTML = 2;
    body.appendChild(divFrame);
    return Promise.resolve(body)
  }, bodyHandle);

  screenPusher = await page.screenshot({ path: './assets/example1.png', clip: { x: 0, y: 0, height: 300, width: 300 }});
  screenArray.push(screenPusher);

  await page.evaluate((body) => {
    const divFrame = document.createElement('span');
    const input = document.querySelector('input[type="text"]')
    input.value += 'duct';

    divFrame.setAttribute('style', 'position: absolute; top: 280px; left: 280px');
    divFrame.innerHTML = 3;
    body.appendChild(divFrame);
    return Promise.resolve(body)
  }, bodyHandle);

  screenPusher = await page.screenshot({ path: './assets/example2.png', clip: { x: 0, y: 0, height: 300, width: 300 } });
  screenArray.push(screenPusher);

  let ffmpeg = spawn("ffmpeg", [
    "-video_size", "300x300",
    "-loglevel", "debug",
    '-y',
    "-framerate", "60",
    "-f", "image2pipe", 
    "-pix_fmt", "yuv420p", 
    "-vcodec", "png", 
    '-r', '30', 
    "-i", "-",
    '-vcodec', 'libx264',
    '-qscale', '0',
    'out.mp4'
  ], {
      stdio: ["pipe", process.stdout, process.stderr]
  });

  for (let i = 0; i < screenArray.length; i++) {
      ffmpeg.stdin.write(screenArray[i]);
  }

  // ffmpeg.stderr.pipe(process.stdout)

  await browser.close();
})();
