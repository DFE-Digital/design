const fs = require('fs')
const path = require('path')

const viewsFolder = path.join(__dirname, 'app', 'views')
const outputConfigFile = path.join(__dirname, 'pa11y-ci.json')
const baseUrl = 'http://localhost:3066'

function getViewFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir)

  files.forEach(file => {
    const filePath = path.join(dir, file)
    if (fs.statSync(filePath).isDirectory()) {
      getViewFiles(filePath, fileList)
    } else if (file.endsWith('.html')) {
      const relativePath = path.relative(viewsFolder, filePath)
      const urlPath = '/' + relativePath.replace(/\\/g, '/').replace('.html', '')
      fileList.push(`${baseUrl}${urlPath}`)
    }
  })

  return fileList
}

const urls = getViewFiles(viewsFolder)

// Log the URLs to ensure they are correct
console.log('Generated URLs:', urls)

const pa11yConfig = {
  defaults: {
    timeout: 30000,
    standard: 'WCAG2AA',
    screenCapture: 'screenshots',
    chromeLaunchConfig: {
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  },
  urls: urls,
  reporter: ['json'],
  json: {
    file: 'pa11y-results.json'
  }
}

fs.writeFileSync(outputConfigFile, JSON.stringify(pa11yConfig, null, 2), 'utf-8')

console.log(`Pa11y configuration file generated with ${urls.length} URLs`)
