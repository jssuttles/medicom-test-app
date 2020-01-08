const express = require('express');

const router = express.Router({});

/**
 * @api {get} /
 * @apiName Home
 * @apiGroup RenderIndex
 *
 * @apiDescription
 * Render home page
 *
 * @apiSuccess {Page} index page
 */
router.get('/', (req, res) => {
  res.render('index', { title: 'Medicom Interview App' });
});

/**
 * @api {get} /messenger
 * @apiName Messenger
 * @apiGroup RenderIndex
 *
 * @apiDescription
 * Render messenger page
 *
 * @apiSuccess {Page} messenger page
 */
router.get('/messenger', (req, res) => {
  res.render('messenger', { title: 'Medicom Interview App: Messenger' });
});

/**
 * @api {get} /displayUsers
 * @apiName DisplayUsers
 * @apiGroup RenderIndex
 *
 * @apiDescription
 * Render displayUsers page
 *
 * @apiSuccess {Page} displayUsers page
 */
router.get('/displayUsers', (req, res) => {
  res.render('displayUsers', { title: 'Medicom Interview App: Users' });
});

/**
 * @api {get} /websocket
 * @apiName WebsocketServer
 * @apiGroup Data
 *
 * @apiDescription
 * Return websocket server address
 *
 * @apiSuccess {String} websocket server address
 */
router.get('/websocket', (req, res) => {
  res.json('ws://localhost:3000');
});

module.exports = router;
