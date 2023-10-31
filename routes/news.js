const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('pages/news', {
        title: 'News'
    })
});

router.post('/', (req, res) => {

    res.render('pages/check', {
        title: 'Check News',
        url: req.body.url,
        allowed: 'allowed',
    })
});

module.exports = router