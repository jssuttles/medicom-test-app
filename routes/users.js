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
  try {
    const data = req.body;
    const ret = models.User.create(data); //can I not await it?
    return 1; //success?
  } catch (e) {
    e.status = 500;
    return e; //not sure if this is proper error handling
  }
});

module.exports = router;
