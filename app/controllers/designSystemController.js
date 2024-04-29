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
    const packageName = 'dfe-webfrontend';
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


exports.get_our_work = async function (req, res) {

    console.log('our work')

    var posts = {
        method: 'get',
        url: `${process.env.cmsurl}api/posts?publicationState=live&sort=Publication_date%3Adesc&pagination[limit]=4&populate=%2A`,
        headers: {
            Authorization: 'Bearer ' + process.env.apikey,
        },
    }


    axios(posts)
        .then(function (response) {
            var posts = response.data

            res.render('our-work/index', { posts })

        })
        .catch(function (error) {
            console.log(error)
        })




}