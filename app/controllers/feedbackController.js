const Airtable = require('airtable')
const base = new Airtable({ apiKey: process.env.airtableFeedbackKey }).base(process.env.airtableFeedbackBase)

exports.post_helpful = async function (req, res) {
  const { response } = req.body
  const service = 'Design manual'
  const pageURL = req.headers.referer || 'Unknown'

  base('Data').create([
    {
      fields: {
        Response: response,
        Service: service,
        URL: pageURL
      }
    }
  ], function (err) {
    if (err) {
      console.error(err)
      return res.status(500).send('Error saving to Airtable')
    }
    res.json({ success: true, message: 'Feedback submitted successfully' })
  })
}

// New route for handling detailed feedback submissions
exports.post_feedback = async function (req, res) {
  const { response } = req.body

  const service = 'Design manual' // Example service name
  const pageURL = req.headers.referer || 'Unknown' // Attempt to capture the referrer URL

  base('Feedback').create([{
    fields: {
      Feedback: response,
      Service: service,
      URL: pageURL
    }
  }], function (err) {
    if (err) {
      console.error(err)
      return res.status(500).send('Error saving to Airtable')
    }
    res.json({ success: true, message: 'Feedback submitted successfully' })
  })
}
