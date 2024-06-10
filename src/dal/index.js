const { AccountsDal } = require('./account');
const { AdminDal } = require('./admin');
const { CompanyDal } = require('./company');
const { ResetPasswordTokensDal } = require('./resetPasswordTokens');

module.exports = {
  AccountsDal,
  AdminDal,
  CompanyDal,
  ResetPasswordTokensDal,
};
