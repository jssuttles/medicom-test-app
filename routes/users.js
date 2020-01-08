const express = require('express');

const router = express.Router({});

const models = require('../models');

/**
 * @api {get} /users/
 * @apiName GetUsers
 * @apiGroup Users
 *
 * @apiDescription
 * Get all users
 *
 * @apiSuccess {Object[]} users
 *
 * @apiError error if DB search fails
 */
router.get('/', async (req, res, next) => {
  try {
    const users = await models.User.findAll();

    return res.json(users);
  } catch (e) {
    e.status = 500;
    return next(e);
  }
});

/**
 * @api {post} /users/
 * @apiName AddUser
 * @apiGroup Users
 *
 * @apiDescription
 * Add a user
 *
 * @apiParam {???} ???
 *
 * @apiSuccess {???} ???
 *
 * @apiError ???
 */
router.post('/', (req, res) => {
  // TODO: push user data to database
});

module.exports = router;
