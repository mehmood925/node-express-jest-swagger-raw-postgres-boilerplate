const { AccountsDal } = require('../dal/index');
const ERROR_CODES = require('../constant/error-messages');
const CustomError = require('../utils/error');

class AccountsService {
  static async register(params) {
    const response = await AccountsDal.create(params);
    return response;
  }

  static async getAccountsInfo(params) {
    let response = await AccountsDal.getByIndex('userId', params.id);
    if(response.length === 0) {
      throw new CustomError(ERROR_CODES.RECORD_NOT_FOUND);
    }
    return response;
  }

  static async updateBalance(params) {
    let response = await AccountsDal.getByIndex('id', params.id);
    if(response.length === 0) {
      throw new CustomError(ERROR_CODES.RECORD_NOT_FOUND);
    }
    [response] = response;
    if(response.userid !== params.userId) {
      throw new CustomError(ERROR_CODES.RECORD_NOT_FOUND);
    }
    await AccountsDal.updateById(response.id, [{
      column: 'balance',
      value: params.balance
    }]);
    return true;
  }

  static async delete(params) {
    const response = await AccountsDal.deleteById(params.id);
    return response;
  }
}
module.exports = { AccountsService };
