const { AccountsService } = require('../service/account');
const { responseHandler } = require('../utils/response');
class AccountsController {
  static async register(req, res, next) {
    try {
      const result = await AccountsService.register(req.body);
      return responseHandler({
        response: res,
        result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAccountsInfo(req, res, next) {
    try {
      const result = await AccountsService.getAccountsInfo({
        id: req.headers.loggedUser.id,
      });
      return responseHandler({
        response: res,
        result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateBalance(req, res, next) {
    try {
      const result = await AccountsService.updateBalance({
        id: req.query.id,
        balance: req.body.balance,
        user_id: req.headers.loggedUser.id
      });
      return responseHandler({
        response: res,
        result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const result = await AccountsService.delete({ id: req.query.id });
      return responseHandler({
        response: res,
        result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { AccountsController };
