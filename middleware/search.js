// searchIndex.js
const axios = require('axios');
const cheerio = require('cheerio');
const xml2js = require('xml2js');
const lunr = require('lunr');

/**
 * We store:
 *   - the built search index
 *   - a map of page data to retrieve extra info (title, URL) for display
 */
let searchIndex;
let pageStore = {}; // key: URL, value: { title, description, headings, body }

async function buildSearchIndex(sitemapUrl) {
  try {
    // 1. Fetch the sitemap.xml
    const sitemapResponse = await axios.get(sitemapUrl);
    const sitemapXml = sitemapResponse.data; // Axios puts the response body in .data

    // 2. Parse XML to get page URLs
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(sitemapXml);

    // 'urlset.url' is typical for a standard sitemap. Adjust if your structure differs.
    const urls = result.urlset.url.map(entry => entry.loc[0]);

    // 3. For each URL, fetch the page HTML and extract the content
    for (const url of urls) {
      try {
        const pageResponse = await axios.get(url);
        const html = pageResponse.data;
        extractPageData(url, html);
      } catch (err) {
        console.error(`Error fetching ${url}:`, err.message);
      }
    }

    // 4. Build the Lunr index with weighting
    searchIndex = lunr(function () {
      this.ref('url');
      // We can “boost” fields that are more important:
      this.field('title', { boost: 10 });
      this.field('headings', { boost: 5 });
      this.field('description', { boost: 3 });

      // Add documents to the index
      for (const [url, data] of Object.entries(pageStore)) {
        this.add({
          url,
          title: data.title,
          description: data.description,
          headings: data.headings.join(' ')
        });
      }
    });

    console.log(`Index built with ${Object.keys(pageStore).length} pages.`);
    return searchIndex;
  } catch (error) {
    console.error('Error building search index:', error.message);
  }
}

function extractPageData(url, html) {
  const $ = cheerio.load(html);

  // Get the <title> (if present)
  const title = $('title').text().trim();

  // Get the meta description (if present)
  const description = $('meta[name="description"]').attr('content') || '';

  // Gather headings (h1, h2, h3). Adjust to your needs
  const h1s = $('h1').map((_, el) => $(el).text()).get();
  const h2s = $('h2').map((_, el) => $(el).text()).get();
  const h3s = $('h3').map((_, el) => $(el).text()).get();
  const allHeadings = [...h1s, ...h2s, ...h3s];

  // Extract the body text (heuristic: take main content minus script/style)
  // For simplicity, this selects the entire <body>:
  const bodyText = $('body').text().replace(/\s+/g, ' ').trim();

  pageStore[url] = {
    title: title || '',
    description,
    headings: allHeadings,
    body: bodyText
  };
}

/**
 * Conduct a search in the Lunr index (if it exists) and return up to N results.
 */
function search(query, limit = 10) {
  if (!searchIndex) {
    console.error('Search index not ready. Did you call buildSearchIndex()?');
    return [];
  }
  const results = searchIndex.search(query).slice(0, limit);

  // Map results to a display-friendly format
  return results.map(result => {
    const matchedUrl = result.ref;
    const data = pageStore[matchedUrl];
    return {
      url: matchedUrl,
      title: data.title || matchedUrl,
      description: data.description,
      score: result.score
    };
  });
}

module.exports = {
  buildSearchIndex,
  search
};
