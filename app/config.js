module.exports = {

  // Base URL
  baseURL: process.env.BASE_URL || 'https://design.education.gov.uk/',

  // Environment
  env: process.env.NODE_ENV || 'development',

  // Port to run local development server on
  port: process.env.PORT || 3001,
  githubrepo: 'https://github.com/DFE-Digital/ucd-manual',
  
  assetPath: process.env.assetPath
};


