const express = require('express');

const router = express.Router({});

const models = require('../models');

router.get('/', async (req, res, next) => {
  try {
    const users = await models.User.findAll();

    return res.json(users);
  } catch (e) {
    e.status = 500;
    return next(e);
  }
});

router.post('/', (req, res) => {
  // TODO: push user data to database
});

module.exports = router;
