const twilio = require('twilio');
const Router = require('express').Router;
const ivrRouter = require('./ivr/router');

const router = new Router();

router.use('/ivr', twilio.webhook({validate: false}), ivrRouter);

module.exports = router;
