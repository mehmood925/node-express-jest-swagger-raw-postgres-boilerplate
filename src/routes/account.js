const express = require('express');
const accountsRouter = express.Router();
const { authMiddleware } = require('../middleware/auth');
const { AccountsController } = require('../controllers/accounts');

accountsRouter.post('/register', AccountsController.register);
accountsRouter.get('/getAccounts', authMiddleware, AccountsController.getAccountsInfo);
accountsRouter.patch('/updateBalance', authMiddleware, AccountsController.updateBalance);
accountsRouter.delete('/delete', AccountsController.delete);

module.exports = accountsRouter;
