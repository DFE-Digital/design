const express = require('express');
const nunjucks = require('nunjucks');
const https = require('https');
const axios = require('axios');
var dateFilter = require('nunjucks-date-filter');
var markdown = require('nunjucks-markdown');
var marked = require('marked');
var Recaptcha = require('express-recaptcha').RecaptchaV3;
const bodyParser = require('body-parser');
const lunr = require('lunr');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const config = require('./app/config');
const puppeteer = require('puppeteer');
const glob = require('glob');
const forceHttps = require('express-force-https');
var compression = require('compression');

const helmet = require('helmet');

const favicon = require('serve-favicon');

const PageIndex = require('./middleware/pageIndex');
const pageIndex = new PageIndex(config);
require('dotenv').config();
var NotifyClient = require('notifications-node-client').NotifyClient;

const app = express();

app.use(compression());

const notify = new NotifyClient('x');
const recaptcha = new Recaptcha(
  process.env.recaptchaPublic,
  process.env.recaptchaSecret,
  { callback: 'cb' },
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(path.join(__dirname, 'public/assets/images', 'favicon.ico')));

app.set('view engine', 'html');

app.locals.serviceName = 'Design Manual';
app.locals.recaptchaPublic = process.env.recaptchaPublic;

// Set up Nunjucks as the template engine
var nunjuckEnv = nunjucks.configure(
  [
    'app/views',
    'node_modules/govuk-frontend',
    'node_modules/dfe-frontend-alpha/packages/components',
  ],
  {
    autoescape: true,
    express: app,
  },
);

nunjuckEnv.addFilter('date', dateFilter);
markdown.register(nunjuckEnv, marked.parse);

nunjuckEnv.addFilter('formatNumber', function (number) {
  return number.toLocaleString();
});

app.use(forceHttps);

// Set up static file serving for the app's assets
app.use('/assets', express.static('public/assets'));

app.use((req, res, next) => {
  if (req.url.endsWith('/') && req.url.length > 1) {
    const canonicalUrl = req.url.slice(0, -1);
    res.set('Link', `<${canonicalUrl}>; rel="canonical"`);
  }
  next();
});

// Render sitemap.xml in XML format
app.get('/sitemap.xml', (_, res) => {
  res.set({ 'Content-Type': 'application/xml' });
  res.render('sitemap.xml');
});

app.get('/robots.txt', (_, res) => {
  res.set({ 'Content-Type': 'text/plain' });
  res.render('robots.txt');
});

app.get('/downloads/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '/app/assets/downloads/' + filename);
  // Set appropriate headers
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  );
  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  // Send the file
  res.sendFile(filePath);
});



app.get('/search', (req, res) => {
  console.log(req.query['searchterm']);
  const query = req.query['searchterm'] || '';
  const resultsPerPage = 10;
  let currentPage = parseInt(req.query.page, 10);
  const results = pageIndex.search(query);
  console.log('Results: ' + results);
  console.log('Query: ' + query);

  const maxPage = Math.ceil(results.length / resultsPerPage);
  if (!Number.isInteger(currentPage)) {
    currentPage = 1;
  } else if (currentPage > maxPage || currentPage < 1) {
    currentPage = 1;
  }

  const startingIndex = resultsPerPage * (currentPage - 1);
  const endingIndex = startingIndex + resultsPerPage;

  res.render('search.html', {
    currentPage,
    maxPage,
    query,
    results: results.slice(startingIndex, endingIndex),
    resultsLen: results.length,
  });
});

if (config.env !== 'development') {
  setTimeout(() => {
    pageIndex.init();
  }, 2000);
}

app.post('/submit-feedback', (req, res) => {
  const feedback = req.body.feedback_form_input;
  const fullUrl = req.headers.referer || 'Unknown';

  //Send to notify after validation with recaptcha first
  //TODO: Implement recaptcha

  notify
    .sendEmail(process.env.feedbackTemplateID, 'design.ops@education.gov.uk', {
      personalisation: {
        feedback: feedback,
        page: fullUrl,
        service: 'Design Manual',
      },
    })
    .then((response) => {})
    .catch((err) => console.log(err));

  return res.sendStatus(200);
});

app.get('/design-system/dfe-frontend', function (req, res, next) {
  const packageName = 'dfe-frontend-alpha';
  let version = '-';

  axios
    .get(`https://registry.npmjs.org/${packageName}`)
    .then((response) => {
      const version = response.data['dist-tags'].latest;
      const lastUpdatedv = new Date(response.data.time.modified).toISOString();

      res.render('design-system/dfe-frontend/index.html', {
        version,
        lastUpdatedv,
      });
    })
    .catch((error) => {
      console.error(error);
    });
});

app.get(
  '/design-system/dfe-frontend/sass-documentation',
  function (req, res, next) {
    const packageName = 'dfe-frontend-alpha';
    let version = '-';

    axios
      .get(`https://registry.npmjs.org/${packageName}`)
      .then((response) => {
        const version = response.data['dist-tags'].latest;
        const lastUpdatedv = new Date(
          response.data.time.modified,
        ).toISOString();

        res.render('design-system/dfe-frontend/sass-documentation/index.html', {
          version,
          lastUpdatedv,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  },
);

app.get('/tools/inclusivity-calculator/:number', (req, res) => {
  var number = parseInt(req.params.number | 0);

  if (number) {
    fs.readFile('./app/data/stats.json', 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading data.json:', err);
        res.sendStatus(500);
        return;
      }

      try {
        const jsonData = JSON.parse(data);
        const calculatedData = calculateValues(jsonData, number);

        res.render('tools/inclusivity-calculator/index.html', {
          number,
          calculatedData,
        });
      } catch (err) {
        console.error('Error parsing data.json:', err);
        res.sendStatus(500);
      }
    });
  } else {
    res.redirect('/tools/inclusivity-calculator');
  }
});

app.post('/tools/inclusivity-calculator', (req, res) => {
  var number = req.body.numberOfUsers;

  if (number) {
    res.redirect('/tools/inclusivity-calculator/' + number);
  } else {
    res.redirect('/tools/inclusivity-calculator');
  }
});

function calculateValues(data, number) {
  const calculatedData = [];

  data.forEach((item) => {
    const numberresult = Math.ceil((item.percent / 100) * number); // Round up to the nearest whole number so we can account for sub 1 %'s on low user numbers.
    calculatedData.push({
      measure: item.measure,
      number: numberresult,
      source: item.source,
      summary: item.summary,
      type: item.type,
    });
  });

  calculatedData.sort((a, b) => b.number - a.number);

  return calculatedData;
}

app.get(/\.html?$/i, function (req, res) {
  var path = req.path;
  var parts = path.split('.');
  parts.pop();
  path = parts.join('.');
  res.redirect(path);
});

app.get(/^([^.]+)$/, function (req, res, next) {
  matchRoutes(req, res, next);
});

// Handle 404 errors
app.use(function (req, res, next) {
  res.status(404).render('error.html');
});

// Handle 500 errors
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).render('error.html');
});

// Try to match a request to a template, for example a request for /test
// would look for /app/views/test.html
// and /app/views/test/index.html

function renderPath(path, res, next) {
  // Try to render the path
  res.render(path, function (error, html) {
    if (!error) {
      // Success - send the response
      res.set({ 'Content-type': 'text/html; charset=utf-8' });
      res.end(html);
      return;
    }
    if (!error.message.startsWith('template not found')) {
      // We got an error other than template not found - call next with the error
      next(error);
      return;
    }
    if (!path.endsWith('/index')) {
      // Maybe it's a folder - try to render [path]/index.html
      renderPath(path + '/index', res, next);
      return;
    }
    // We got template not found both times - call next to trigger the 404 page
    next();
  });
}

matchRoutes = function (req, res, next) {
  var path = req.path;

  // Remove the first slash, render won't work with it
  path = path.substr(1);

  // If it's blank, render the root index
  if (path === '') {
    path = 'index';
  }

  renderPath(path, res, next);
};

// Start the server

// // Run application on configured port
// if (config.env === 'development') {
//   app.listen(config.port - 50, () => {
//   });
// } else {
//   app.listen(config.port);
// }