/**
 * Author:          Andy Jones - Department for Education
 * Description:     Routes for the application
 * GitHub Issue:    https://github.com/DFE-Digital/design
 */

// DEPENDENCIES //
const express = require('express')
const router = express.Router()

// CONTROLLERS //
const designSystemController = require('./controllers/designSystemController.js');
const professionsController = require('./controllers/professionsController.js');





router.get("/frontend", designSystemController.get_frontend);
router.get("/design-system/dfe-frontend", designSystemController.get_frontend);
router.get("/design-system", designSystemController.get_index);


router.get("/our-work", designSystemController.get_our_work);

// Professions
router.get("/professions/content-design", professionsController.get_content_design);





// Redundant routes // 
// These routes are no longer applicable, due to structure changes, but redirect them to the new pages //

router.get("/inside-design/professions/content-design",  (req, res) => {
    return res.redirect(301, '/professions/content-design')
});

router.get("/inside-design/projects/family-hubs",  (req, res) => {
    return res.redirect(301, '/our-work/projects/family-hubs')
});

router.get("/inside-design/projects/education-health-care-plan",  (req, res) => {
    return res.redirect(301, '/our-work/projects/education-health-care-plan')
});

router.get("/content-design",  (req, res) => {
    return res.redirect(301, '/design-system/content-design')
});

router.get("/content-design/:path",  (req, res) => {
    const {path} = req.params;
    return res.redirect(301, '/design-system/'+path)
});

module.exports = router