/* eslint-disable indent */
/**
 * Author:          Andy Jones - Department for Education
 * Description:     Routes for the application
 * GitHub Issue:    https://github.com/DFE-Digital/design
 */

// DEPENDENCIES //
const express = require('express')
const router = express.Router()

// CONTROLLERS //
const designSystemController = require('./controllers/designSystemController.js')
const professionsController = require('./controllers/professionsController.js')
const designOpsController = require('./controllers/designOpsController.js')
const feedbackController = require('./controllers/feedbackController.js')


router.get('/design-system', designSystemController.get_index)

router.get('/our-work', designSystemController.get_our_work)

// Professions
router.get('/professions/content-design', professionsController.get_content_design)

router.get('/design-ops/satisfaction-scores', designOpsController.get_sat_scores)

// Feedback
router.post('/form-response/helpful', feedbackController.post_helpful)
router.post('/form-response/feedback', feedbackController.post_feedback)

// Redundant routes //
// These routes are no longer applicable, due to structure changes, but redirect them to the new pages //

router.get('/tools/inclusivity-calculator', (req, res) => {
    return res.redirect(301, '/tools/how-many-users')
})

router.get('/professions/content-design', (req, res) => {
    return res.redirect(301, '/professions/content-design')
})

router.get('/inside-design/projects/family-hubs', (req, res) => {
    return res.redirect(301, '/our-work/projects/family-hubs')
})

router.get('/inside-design/projects/education-health-care-plan', (req, res) => {
    return res.redirect(301, '/our-work/projects/education-health-care-plan')
})

router.get('/content-design', (req, res) => {
    return res.redirect(301, '/design-system/content-design')
})

router.get('/content-design/:path', (req, res) => {
    const { path } = req.params
    return res.redirect(301, '/design-system/' + path)
})

module.exports = router
