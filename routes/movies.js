const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('pages/movies', {
        title: 'Movies'
    })
});

router.post('/', (req, res) => {

    res.render('pages/check', {
        title: 'Check Movies',
        url: req.body.url,
        allowed: 'allowed',
    })
});

module.exports = router