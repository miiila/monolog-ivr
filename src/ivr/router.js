const Router = require('express').Router;
const {welcome, menu, giveHint} = require('./handler');

const router = new Router();

// POST: /ivr/welcome
router.post('/welcome', (req, res) => {
  res.send(welcome());
});

// POST: /ivr/menu
router.post('/menu', (req, res) => {
  const digits = req.body.Digits;
  return res.send(menu(digits));
});

// POST: /ivr/giveHint
router.post('/giveHint', (req, res) => {
  const digit = req.body.Digits;
  res.send(giveHint(digit, req.query.code));
});

module.exports = router;
