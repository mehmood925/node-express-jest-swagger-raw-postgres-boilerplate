const { CompanyDal } = require('../dal/index');

class CompanyService {
  static async register(params) {
    const response = await CompanyDal.register(params);
    return response;
  }

  static async getCompeniesInfo() {
    const response = await CompanyDal.getCompeniesInfo();
    return response;
  }

  static async getByIndex(index, value) {
    const response = await CompanyDal.getByIndex(index, value);
    return response;
  }

  static async deleteById(id) {
    const response = await CompanyDal.deleteById(id);
    return response;
  }
}
module.exports = { CompanyService };
