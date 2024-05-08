/* eslint-disable quote-props */
// Page specific
const additionalIndices = {
  '/professions/interaction-design': ['ixd, ux, ui'],
  '/professions/service-design': ['sd'],
  '/user-research': ['ur, research, user needs'],
  '/accessibility': ['wcag, usability, inclusive design'],
  '/professions/content-design': ['writing']
}

// Term specific
const alternativeSpelling = {
  '&': ['ampersand'],
  'dfe': ['Department for Education'],
  'esfa': ['Education and Skills Funding Agency']
}

const indexBlacklist = [
  '/'
]

module.exports = { additionalIndices, alternativeSpelling, indexBlacklist }
