const pa11y = require('pa11y');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const viewsFolder = path.join(__dirname, 'app', 'views');
const baseUrl = 'http://localhost:3066';
const outputFile = 'pa11y-results.json';

function getViewFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getViewFiles(filePath, fileList);
    } else if (file.endsWith('.html')) {
      const relativePath = path.relative(viewsFolder, filePath);
      const urlPath = '/' + relativePath.replace(/\\/g, '/').replace('.html', '');
      fileList.push(`${baseUrl}${urlPath}`);
    }
  });

  return fileList;
}

async function runPa11y(urls) {
  const results = [];
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  for (const url of urls) {
    console.log(`Running Pa11y for ${url}`);
    const result = await pa11y(url, {
      browser: browser,
      standard: 'WCAG2AA',
      timeout: 30000,
      chromeLaunchConfig: {
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    });
    results.push(result);
  }

  await browser.close();
  fs.writeFileSync(outputFile, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`Pa11y results written to ${outputFile}`);
}

const urls = getViewFiles(viewsFolder);
console.log('Generated URLs:', urls);

runPa11y(urls).catch(error => {
  console.error('Error running Pa11y:', error.message);
});
