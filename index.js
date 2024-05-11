require('dotenv').config()

const express = require('express')
const nunjucks = require('nunjucks')
const axios = require('axios')
const dateFilter = require('nunjucks-date-filter')
const markdown = require('nunjucks-markdown')
const marked = require('marked')
const GovukHTMLRenderer = require('govuk-markdown')
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path')
const config = require('./app/config')
const forceHttps = require('express-force-https')
const compression = require('compression')
const routes = require('./app/routes')
const session = require('express-session')
const favicon = require('serve-favicon')
const PageIndex = require('./middleware/pageIndex')
const pageIndex = new PageIndex(config)

const app = express()
app.use(compression())

app.use(
  session({
    secret: process.env.sessionkey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Note: `secure: true` in a production environment with HTTPS
  })
)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(favicon(path.join(__dirname, 'public/assets/images', 'favicon.ico')))

app.set('view engine', 'html')
app.locals.serviceName = 'Design manual'

// Set up Nunjucks as the template engine
const nunjuckEnv = nunjucks.configure(
  [
    'app/views',
    'node_modules/govuk-frontend/dist/',
    'node_modules/dfe-frontend/packages/components'
  ],
  {
    autoescape: true,
    express: app
  }
)

nunjuckEnv.addFilter('date', dateFilter)
marked.setOptions({
  renderer: new GovukHTMLRenderer()
})
markdown.register(nunjuckEnv, marked.parse)

nunjuckEnv.addFilter('formatNumber', function (number) {
  return number.toLocaleString()
})

nunjuckEnv.addFilter('hyphen', function (str) {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
})

app.use(forceHttps)

// Set up static file serving for the app's assets
app.use('/assets', express.static('public/assets'))

app.use((req, res, next) => {
  if (req.url.endsWith('/') && req.url.length > 1) {
    const canonicalUrl = req.url.slice(0, -1)
    res.set('Link', `<${canonicalUrl}>; rel="canonical"`)
  }
  next()
})

app.use('/', routes)

// Render sitemap.xml in XML format
app.get('/sitemap.xml', (_, res) => {
  res.set({ 'Content-Type': 'application/xml' })
  res.render('sitemap.xml')
})

app.get('/robots.txt', (_, res) => {
  res.set({ 'Content-Type': 'text/plain' })
  res.render('robots.txt')
})

app.get('/downloads/:filename', (req, res) => {
  const filename = req.params.filename
  const filePath = path.join(__dirname, '/app/assets/downloads/' + filename)
  // Set appropriate headers
  //  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`)
  // Send the file
  res.sendFile(filePath)
})

app.get('/search', (req, res) => {
  console.log(req.query.searchterm)
  const query = req.query.searchterm || ''
  const resultsPerPage = 10
  let currentPage = parseInt(req.query.page, 10)
  const results = pageIndex.search(query)
  console.log('Results: ' + results)
  console.log('Query: ' + query)

  const maxPage = Math.ceil(results.length / resultsPerPage)
  if (!Number.isInteger(currentPage)) {
    currentPage = 1
  } else if (currentPage > maxPage || currentPage < 1) {
    currentPage = 1
  }

  const startingIndex = resultsPerPage * (currentPage - 1)
  const endingIndex = startingIndex + resultsPerPage

  res.render('search.html', {
    currentPage,
    maxPage,
    query,
    results: results.slice(startingIndex, endingIndex),
    resultsLen: results.length
  })
})

if (config.env !== 'development') {
  setTimeout(() => {
    pageIndex.init()
  }, 2000)
}

// Your custom middleware to automatically save form data to session
function saveFormDataToSession(req, res, next) {
  if (req.method === 'POST') {
    req.session.data = {
      ...req.session.data, // Existing session data
      ...req.body // New form data
    }
  }
  next()
}

// Middleware to make formData globally available to all views
function makeFormDataGlobal(req, res, next) {
  // Perform a shallow merge of existing res.locals.data and session data
  res.locals.data = {
    ...res.locals.data, // Existing data
    ...req.session.data // Data from the session
  }
  next()
}

// Register the middlewares globally
app.use(saveFormDataToSession)
app.use(makeFormDataGlobal)

app.get('/learn/how-many-users', function (req, res) {
  res.redirect(301, '/tools/how-many-users')
})

app.get('/learn/how-many-users/:number', function (req, res) {
  const number = req.params.number
  res.redirect(301, '/tools/how-many-users/' + number)
})

app.get('/design-ops/design-maturity/september-2022', function (req, res) {
  res.redirect('/inside-design/maturity/results/september-2022', 301)
})

app.get('/design-ops/maturity/results/september-2023', function (req, res) {
  const data = require('./app/data/dm_2023.json')

  res.render('design-ops/maturity/results/september-2023', { data })
})

app.get(
  '/design-system/dfe-frontend',
  function (req, res, next) {
    const packageName = 'dfe-frontend'

    axios
      .get(`https://registry.npmjs.org/${packageName}`)
      .then((response) => {
        const version = response.data['dist-tags'].latest
        const lastUpdatedv = new Date(
          response.data.time.modified
        ).toISOString()

        res.render('design-system/dfe-frontend/index.html', {
          version,
          lastUpdatedv
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }
)

app.get(
  '/design-system/installation',
  function (req, res, next) {
    const packageName = 'dfe-frontend'

    axios
      .get(`https://registry.npmjs.org/${packageName}`)
      .then((response) => {
        const version = response.data['dist-tags'].latest
        const lastUpdatedv = new Date(
          response.data.time.modified
        ).toISOString()

        res.render('design-system/installation/index.html', {
          version,
          lastUpdatedv
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }
)

app.get(
  '/design-system/dfe-frontend/whats-new',
  function (req, res, next) {
    const packageName = 'dfe-frontend'

    axios
      .get(`https://registry.npmjs.org/${packageName}`)
      .then((response) => {
        const version = response.data['dist-tags'].latest

        const sortedFilteredVersions = Object.entries(response.data.time)
          .filter(([version, _]) => version.includes('.') && version.startsWith('2'))
          .sort(([versionA, _a], [versionB, _b]) => versionB.localeCompare(versionA))

        const lastUpdatedv = new Date(
          response.data.time.modified
        ).toISOString()

        res.render('design-system/dfe-frontend/whats-new.html', {
          version,
          lastUpdatedv,
          sortedFilteredVersions
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }
)

app.get('/tools/how-many-users/:number', (req, res) => {
  const number = parseInt(req.params.number | 0)

  if (number) {
    fs.readFile('./app/data/stats.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading data.json:', err)
        res.sendStatus(500)
        return
      }

      try {
        const jsonData = JSON.parse(data)
        const calculatedData = calculateValues(jsonData, number)

        res.render('tools/how-many-users/index.html', {
          number,
          calculatedData
        })
      } catch (err) {
        console.error('Error parsing data.json:', err)
        res.sendStatus(500)
      }
    })
  } else {
    res.redirect('/tools/how-many-users')
  }
})

app.post('/tools/how-many-users', (req, res) => {
  const number = req.body.numberOfUsers

  if (number) {
    res.redirect('/tools/how-many-users/' + number)
  } else {
    res.redirect('/tools/how-many-users')
  }
})

app.get('/tools/jd-generator', (req, res) => {
  res.render('tools/jd-generator/index.html')
})

app.get('/tools/proposition-checker/question1', (req, res) => {
  console.log(req.session.data)

  res.render('tools/proposition-checker/question1')
})

app.post('/tools/proposition-checker/question1', (req, res) => {
  console.log(req.session.data)

  if (req.body.question1 === 'No') {
    res.redirect('/tools/proposition-checker/nongovuk')
  } else {
    res.redirect('/tools/proposition-checker/question2')
  }
})

app.post('/tools/proposition-checker/question2', (req, res) => {
  if (req.body.question2 === 'No') {
    res.redirect('/tools/proposition-checker/nongovuk')
  } else {
    res.redirect('/tools/proposition-checker/question3')
  }
})

app.post('/tools/proposition-checker/question3', (req, res) => {
  if (req.body.question3 === 'Yes') {
    res.redirect('/tools/proposition-checker/mainstream')
  } else {
    res.redirect('/tools/proposition-checker/question4')
  }
})

app.post('/tools/proposition-checker/question4', (req, res) => {
  if (req.body.question4 === 'Yes') {
    res.redirect('/tools/proposition-checker/question4a')
  } else {
    res.redirect('/tools/proposition-checker/question6')
  }
})

app.post('/tools/proposition-checker/question4a', (req, res) => {
  if (req.session.data.question4 === 'Yes') {
    res.redirect('/tools/proposition-checker/question5')
  } else {
    res.redirect('/tools/proposition-checker/question6')
  }
})

app.post('/tools/proposition-checker/question5', (req, res) => {
  console.log(req.session.data)
  res.redirect('/tools/proposition-checker/question6')
})

app.post('/tools/proposition-checker/question6', (req, res) => {
  if (req.session.data.question6 === 'Yes') {
    res.redirect('/tools/proposition-checker/nongovuk')
  } else {
    res.redirect('/tools/proposition-checker/uncertain')
  }
})

app.get('/tools/proposition-checker', (req, res) => {
  req.session.data = {}

  console.log('indexpage')

  res.render('tools/proposition-checker/index')
})

app.get('/tools/proposition-checker/result', (req, res) => {
  console.log(req.session.data)

  res.render('tools/proposition-checker/result')
})

function calculateValues(data, number) {
  const calculatedData = []

  data.forEach((item) => {
    const numberresult = Math.ceil((item.percent / 100) * number) // Round up to the nearest whole number so we can account for sub 1 %'s on low user numbers.
    calculatedData.push({
      measure: item.measure,
      number: numberresult,
      source: item.source,
      summary: item.summary,
      type: item.type
    })
  })

  calculatedData.sort((a, b) => b.number - a.number)

  return calculatedData
}

app.get(/\.html?$/i, function (req, res) {
  let path = req.path
  const parts = path.split('.')
  parts.pop()
  path = parts.join('.')
  res.redirect(path)
})

app.get(/^([^.]+)$/, function (req, res, next) {
  matchRoutes(req, res, next)
})

// Handle 404 errors
app.use(function (req, res, next) {
  res.status(404).render('error.html')
})

// Handle 500 errors
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).render('error.html')
})

// Try to match a request to a template, for example a request for /test
// would look for /app/views/test.html
// and /app/views/test/index.html

function renderPath(path, res, next) {
  // Try to render the path
  res.render(path, function (error, html) {
    if (!error) {
      // Success - send the response
      res.set({ 'Content-type': 'text/html; charset=utf-8' })
      res.end(html)
      return
    }
    if (!error.message.startsWith('template not found')) {
      // We got an error other than template not found - call next with the error
      next(error)
      return
    }
    if (!path.endsWith('/index')) {
      // Maybe it's a folder - try to render [path]/index.html
      renderPath(path + '/index', res, next)
      return
    }
    // We got template not found both times - call next to trigger the 404 page
    next()
  })
}

function matchRoutes(req, res, next) {
  let path = req.path
  path = path.substr(1)
  if (path === '') {
    path = 'index'
  }

  renderPath(path, res, next)
}

app.listen(config.port)
