const express = require('express');
const router = express.Router();
const adminRouter = require('./admin');
const accountsRouter = require('./account');
const companyRouter = require('./company');

const setRouter = (app) => {
  app.use('/api/v1', router);
  router.use(`/admin`, adminRouter);
  router.use(`/accounts`, accountsRouter);
  router.use(`/companies`, companyRouter);
};

module.exports = { setRouter };
