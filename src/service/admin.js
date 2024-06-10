const bcrypt = require('bcrypt');
const passCom = require('joi-password-complexity');
const ERROR_CODES = require('../constant/error-messages');
const CustomError = require('../utils/error');
const { emailService } = require('../utils/email');
const CONST_VARS = require('../constant/constant');
const { AdminDal, ResetPasswordTokensDal } = require('../dal/index');
const {
  issueToken,
  issueResetPassToken,
  validatePasswordToken,
} = require('../middleware/auth');
const _complexityOptions = {
  min: 8,
  max: 26,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
};

class AdminService {
  static async register(params) {
    let _existingProfile = await AdminDal.getByIndex('email', params.email);
    if (_existingProfile.length > 0) {
      throw new CustomError(ERROR_CODES.USER_ALREADY_EXISTS);
    }
    [_existingProfile] = _existingProfile;
    const _pass = passCom(_complexityOptions).validate(params.password); // password validation
    if (_pass.error) {
      throw new CustomError(ERROR_CODES.PASS_RULES_ERROR);
    }
    const response = await AdminDal.register({
      email: params.email,
      password: bcrypt.hashSync(params.password, bcrypt.genSaltSync(2)),
      companyId: params.companyId,
    });
    return response;
  }

  static async login(params) {
    let _profile = await AdminDal.getByIndex('email', params.email);
    if (_profile.length === 0) {
      throw new CustomError(ERROR_CODES.INVALID_EMAIL_PASSWORD);
    }
    [_profile] = _profile;
    if (!(await bcrypt.compare(params.password, _profile.password))) {
      throw new CustomError(ERROR_CODES.INVALID_EMAIL_PASSWORD);
    }
    const _token = issueToken({ id: _profile.id, email: _profile.email });
    return _token;
  }

  static async getProfile(params) {
    let response = await AdminDal.getByIndex('id', params.id);
    if (response.length === 0) {
      throw new CustomError(ERROR_CODES.RECORD_NOT_FOUND);
    }
    [response] = response;
    delete response.password;
    return response;
  }

  static async verifyToken(params) {
    const _decodedToken = validatePasswordToken(params.token);
    if (!_decodedToken) throw new CustomError(ERROR_CODES.TOKEN_FAILED);
    if (_decodedToken === 404) throw new CustomError(ERROR_CODES.TOKEN_FAILED);
    const _tokenCheck = await ResetPasswordTokensDal.getByIndex(
      'token',
      params.token
    );
    if (_tokenCheck.length === 0) {
      throw new CustomError(ERROR_CODES.TOKEN_FAILED);
    }
    return true;
  }

  static async updatePassword(params) {
    let _profile = await AdminDal.getByIndex('id', params.loggedUser.id);
    if (_profile.length === 0) {
      throw new CustomError(ERROR_CODES.INVALID_PASSWORD);
    }
    [_profile] = _profile;
    if (!(await bcrypt.compare(params.password, _profile.password))) {
      throw new CustomError(ERROR_CODES.INVALID_PASSWORD);
    }
    if (params.password === params.newPassword) {
      throw new CustomError(ERROR_CODES.CANNOT_USE_OLD_PASSWORD);
    }
    const _pass = passCom(_complexityOptions).validate(params.newPassword); // password validation
    if (_pass.error) {
      throw new CustomError(ERROR_CODES.PASS_RULES_ERROR);
    }
    await AdminDal.updateById(_profile.id, [
      {
        column: 'password',
        value: bcrypt.hashSync(params.newPassword, bcrypt.genSaltSync(2)),
      },
    ]);
    return true;
  }

  static async forgetPassword(params) {
    let _profile = await AdminDal.getByIndex('email', params.email);
    if (_profile.length === 0) {
      return true;
    }
    [_profile] = _profile;
    const _token = issueResetPassToken({
      id: _profile.id,
      email: _profile.email,
    });
    let _tokenCheck = await ResetPasswordTokensDal.getByIndex(
      'email',
      params.email
    );
    if (_tokenCheck.length === 0) {
      await ResetPasswordTokensDal.create({
        email: params.email,
        token: _token,
      });
    } else {
      [_tokenCheck] = _tokenCheck;
      await ResetPasswordTokensDal.updateById(_tokenCheck.id, [
        {
          column: 'token',
          value: _token,
        },
      ]);
    }
    // const response = await emailService.sendEmail({
    //   email: params.email,
    //   subject: CONST_VARS.CONSTANTS.FORGET_EMAIL_SUBJECT,
    //   body: CONST_VARS.CONSTANTS.FORGET_EMAIL_BODY+_token,
    // });
    // if (response === "ok") return true;
    // else return response;

    // const response = await AdminDal.forgetPassword(params);
    return true;
  }

  static async resetPassword(params) {
    const _pass = passCom(_complexityOptions).validate(params.password); // password validation
    if (_pass.error) {
      throw new CustomError(ERROR_CODES.PASS_RULES_ERROR);
    }
    let _tokenCheck = await ResetPasswordTokensDal.getByIndex(
      'token',
      params.token
    );
    if (_tokenCheck.length === 0) {
      throw new CustomError(ERROR_CODES.RESET_PASS_LINK_EXPIRED);
    }
    [_tokenCheck] = _tokenCheck;
    // verify the token
    let _decodedToken = validatePasswordToken(params.token);
    if (_decodedToken === 404)
      throw new CustomError(ERROR_CODES.RESET_PASS_LINK_EXPIRED);
    let _profile = await AdminDal.getByIndex('email', _decodedToken.email);
    if (_profile.length === 0) {
      throw new CustomError(ERROR_CODES.RESET_PASS_LINK_EXPIRED);
    }
    [_profile] = _profile;
    await ResetPasswordTokensDal.deleteById(_tokenCheck.id);
    await AdminDal.updateById(_decodedToken.id, [
      {
        column: 'password',
        value: bcrypt.hashSync(params.password, bcrypt.genSaltSync(2)),
      },
    ]);
    return true;
  }
}
module.exports = { AdminService };
