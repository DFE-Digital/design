const express = require('express');
const router = express.Router();

const homeController = require('./controllers/home.js');
const ourWorkController = require('./controllers/ourWork.js');

router.get('/', homeController.g_home);

router.get('/our-work', ourWorkController.g_ourWork);
router.get('/our-work/project/:slug', ourWorkController.g_project)



module.exports = router; 