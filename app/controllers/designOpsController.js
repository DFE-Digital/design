require('dotenv').config()
const Airtable = require('airtable')
const base = new Airtable({ apiKey: process.env.airtableFeedbackKey }).base(process.env.airtableFeedbackBase)

exports.get_sat_scores = async function (req, res) {
  try {
    const records = await base('Data').select({
      view: 'All'
    }).all()

    const serviceData = {}
    records.forEach(record => {
      const service = record.get('Service')
      const response = record.get('Response')
      if (!serviceData[service]) {
        serviceData[service] = { yes: 0, total: 0 }
      }
      serviceData[service].total++
      if (response === 'Yes') {
        serviceData[service].yes++
      }
    })

    const data = Object.keys(serviceData).map(service => {
      const { yes, total } = serviceData[service]
      const percentageYes = (yes / total * 100).toFixed(0) // Keep two decimal places
      return { service, percentageYes, total }
    })

    res.render('design-ops/satisfaction-scores/index', { data })
  } catch (error) {
    console.error('Error fetching satisfaction scores from Airtable:', error)
    res.status(500).send('An error occurred while fetching satisfaction scores.')
  }
}
