const express = require('express');

const router = express.Router({});

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Medicom Interview App' });
});

router.get('/messenger', (req, res) => {
  res.render('messenger', { title: 'Medicom Interview App: Messenger' });
});

router.get('/displayUsers', (req, res) => {
  res.render('displayUsers', { title: 'Medicom Interview App: Users' });
});

router.get('/websocket', (req, res) => {
  res.json('ws://localhost:3000');
});

module.exports = router;
