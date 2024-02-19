/**
 * Author:          Andy Jones - Department for Education
 * Description:     Controller for the design system routes
 * GitHub Issue:    https://github.com/DFE-Digital/design
 */


const axios = require('axios');

exports.get_index = async function (req, res) {
    return res.render('design-system/index')
}


exports.get_frontend = async function (req, res) {
    const packageName = 'dfe-frontend-alpha';
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
};


