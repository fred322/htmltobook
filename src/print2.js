const fs = require("node:fs");
const { chromium } = require('playwright');

(async () => {
  // Lancer le navigateur (Chromium par défaut)
  const browser = await chromium.launch({ 
    headless: true,
    executablePath: '/snap/bin/chromium' // Exemple : '/usr/bin/google-chrome'
 });

  // Ouvrir une nouvelle page
  const page = await browser.newPage();

  // Naviguer vers l'URL de ton choix
  await page.goto('http://localhost:8080/test.html', {
    waitUntil: 'networkidle' // Attendre que le réseau soit inactif
  });
let content = await page.content();
fs.writeFileSync("export.xml", content);

  // Générer le PDF
  await page.pdf({
    path: 'sortie.pdf', // Chemin où enregistrer le PDF
    format: 'A4', // Format de la page (A4, Letter, etc.)
    printBackground: true, // Inclure les arrière-plans
    margin: { // Marges (en pouces ou 'none')
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    }
  });

  // Fermer le navigateur
  await browser.close();
})();