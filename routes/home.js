const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('pages/index', {
        title: 'Home'
    })
});

router.post('/', (req, res) => {

    res.render('pages/check', {
        title: 'Check Home',
        url: req.body.url,
        allowed: 'allowed',
    })
});


module.exports = router