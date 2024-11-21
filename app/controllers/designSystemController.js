/**
 * Author:          Andy Jones - Department for Education
 * Description:     Controller for the design system routes
 * GitHub Issue:    https://github.com/DFE-Digital/design
 */

const axios = require('axios')

exports.get_index = async function (req, res) {
  return res.render('design-system/index')
}

exports.get_our_work = async function (req, res) {
  try {
    console.log('our work')

    // Fetching posts
    const postsResponse = await axios({
      method: 'get',
      url: `${process.env.cmsurl}api/posts?publicationState=live&sort=Publication_date%3Adesc&pagination[limit]=4&populate=%2A`,
      headers: {
        Authorization: `Bearer ${process.env.apikey}`,
      }
    })

    const posts = postsResponse.data

    // Fetching projects
    const projectsResponse = await axios({
      method: 'get',
      url: `${process.env.cmsurl}api/our-work-projects?populate=%2A`,
      headers: {
        Authorization: `Bearer ${process.env.apikey}`,
      }
    })

    const work = projectsResponse.data.data

    if (!work) {
      return res.redirect('/our-work')
    }

    // Render the page with the fetched data
    res.render('our-work/index', { posts, work })
  } catch (error) {
    console.error('Error fetching data:', error.message)
    res.status(500).send('An error occurred while fetching the data.')
  }
}

exports.get_project = async function (req, res) {
  const slug = req.params.slug
  console.log('Fetching project with slug:', slug)

  const posts = {
    method: 'get',
    url: `${process.env.cmsurl}api/our-work-projects?filters[Slug][\$eq]=${slug}&populate=%2A`,
    headers: {
      Authorization: `Bearer ${process.env.apikey}`
    }
  }

  axios(posts)
    .then(function (response) {
      const post = response.data.data[0]

      if (!post) {
        return res.redirect('/our-work')
      }

      res.render('our-work/project/index', { post })
    })
    .catch(function (error) {
      console.log(error)
      res.status(500).send('An error occurred while fetching the project')
    })
}

