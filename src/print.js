const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--disable-gpu', '--no-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('file:///home/fred/workspace/AcrobatomaticBuildSystem/doc/html/test.html', { waitUntil: 'networkidle0' });
  await page.emulateMediaType('print');
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