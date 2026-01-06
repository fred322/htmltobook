const fs = require("node:fs");
const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/snap/bin/chromium', // Exemple : '/usr/bin/google-chrome'
    args: ['--disable-gpu', '--no-sandbox']
  });

  console.log("Printing page...");
  const page = await browser.newPage();
  await page.goto('http://localhost:8080/test.html', { waitUntil: 'networkidle0' });
  await page.emulateMediaType('print');
  let content = await page.content();
  fs.writeFileSync("export.xml", content);
  // Générer le PDF sans marges ni en-têtes/pieds de page
  await page.pdf({
    path: 'sortie.pdf',
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: false, // Désactive l'en-tête et le pied de page
    preferCSSPageSize: false,
    margin: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    }
  });

  await browser.close();
})();