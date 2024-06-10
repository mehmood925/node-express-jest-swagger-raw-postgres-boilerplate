const { CompanyService } = require('../service/company');
const { responseHandler } = require('../utils/response');
class CompanyController {
  static async register(req, res, next) {
    try {
      const result = await CompanyService.register(req.body);
      return responseHandler({
        response: res,
        result,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCompaniesInfo(req, res, next) {
    try {
      const result = await CompanyService.getCompeniesInfo();
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
      const result = await CompanyService.deleteById({ id: req.query.id });
      return responseHandler({
        response: res,
        result,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = { CompanyController };
