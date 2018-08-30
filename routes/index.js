const express = require('express');

const router = express.Router({});

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Medicom Interview App' });
});

router.get('/displayUsers', (req, res) => {
  res.render('displayUsers', { title: 'Medicom Interview App: Users' });
});

module.exports = router;
