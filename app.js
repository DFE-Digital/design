const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const path = require('path');
const appRoutes = require('./app/routes.js');
const dateFilter = require('nunjucks-date-filter')
const markdown = require('nunjucks-markdown')
const marked = require('marked')
const govukMarkdown = require('govuk-markdown')
const Airtable = require('airtable')

const app = express();

const base = new Airtable({ apiKey: process.env.airtableFeedbackKey }).base(process.env.airtableFeedbackBase)

// Set up views and nunjucks environment
var nunjuckEnv = nunjucks.configure([
  'app/views',
  'app/views/layouts',
  'node_modules/govuk-frontend/dist/',
  'node_modules/dfe-frontend/packages/components',
], {
  autoescape: true,
  express: app,
  watch: false,
  extension: 'html',
  noCache: false
});

// Serve static files
app.use('/govuk', express.static(path.join(__dirname, 'node_modules/govuk-frontend/govuk/assets')));
app.use('/dfe', express.static(path.join(__dirname, 'node_modules/dfe-frontend/dist')));
app.use('/assets', express.static('app/public'));
app.use(express.json());

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }));


nunjuckEnv.addFilter('date', dateFilter)

marked.use(govukMarkdown({
  headingsStartWith: 'xl'
}))


markdown.register(nunjuckEnv, marked.parse)

// Set view engine to Nunjucks with .html extension
app.set('view engine', 'html');

// 301 Redirects

app.get('/design-ops', (req, res) => {
  res.redirect(301, '/designops');
});


app.get('/our-work', function (req, res) {
  res.redirect(301, 'https://webarchive.nationalarchives.gov.uk/ukgwa/20241206051622/https://design.education.gov.uk/our-work')
})

app.get('/our-work/*', function (req, res) {
  res.redirect(301, 'https://webarchive.nationalarchives.gov.uk/ukgwa/20241206051622/https://design.education.gov.uk/our-work')
})


const { buildSearchIndex, search } = require('./middleware/search.js');
// ...
// Start building index (replace with your actual sitemap URL):
buildSearchIndex('http://localhost:3066/sitemap.xml')
  .then(() => console.log('Search index ready'))
  .catch(err => console.error('Error initialising search:', err));



app.post('/form-response/feedback', (req, res) => {
  const { response } = req.body;

  // Prevent bots submitting empty feedback
  if (!response || response.trim() === '') {
    return res.status(400).json({ success: false, message: 'No feedback provided' });
  }

  // Prevent long feedback
  if (response.length > 400) {
    return res.status(400).json({ success: false, message: 'Feedback too long' });
  }

  console.log("Feedback received:", response);

  const service = 'Design manual'; // Example service name
  const pageURL = req.headers.referer || 'Unknown'; // Capture the referrer URL

  base('Feedback').create([
    {
      fields: {
        Feedback: response,
        Service: service,
        URL: pageURL
      }
    }
  ], function (err, records) {
    if (err) {
      console.error("Airtable Error:", err);
      return res.status(500).json({ success: false, message: 'Could not send feedback' });
    }

    res.json({ success: true, message: 'Thank you for your feedback' });
  });
});


// e.g. add a /search route:
app.get('/search', (req, res) => {
  const query = req.query.q || '';
  let data = [];
  if (!query.trim()) {
    return res.render('search/index', { data });
  }
  const results = search(query);
  // Just pass the results to the template
  return res.render('search/index', { data: results, query });
});



// Use application routes
app.use('/', appRoutes);


// Clean URLs
app.get(/\.html?$/i, function (req, res) {
  let urlPath = req.path;
  const parts = urlPath.split('.');
  parts.pop();
  urlPath = parts.join('.');
  res.redirect(urlPath);
});

// Dynamic Route Matching for URLs without extensions
app.get(/^([^.]+)$/, function (req, res, next) {
  matchRoutes(req, res, next);
});

// Render sitemap.xml in XML format
app.get('/sitemap.xml', (_, res) => {
  res.set({ 'Content-Type': 'application/xml' })
  res.render('sitemap.xml')
})

// Route matching function
function matchRoutes(req, res, next) {
  let path = req.path;

  // Remove the first slash, render won't work with it
  path = path.startsWith('/') ? path.slice(1) : path;

  // If it's blank, render the root index
  if (path === '') {
    path = 'index';
  }

  console.log(path)

  renderPath(path, res, next);
}

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

// Handle 404 errors
app.use(function (req, res, next) {
  res.status(404).render('404.html');
});

// Start the server
const PORT = process.env.PORT || 3066;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});