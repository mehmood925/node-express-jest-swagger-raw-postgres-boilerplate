const ERROR_CODES = require('../constant/error-messages');
const CustomError = require('../utils/error');
const pool = require('../utils/database');
const { DateTime } = require('luxon');

class AdminDal {
  static async create(params) {
    let keys = Object.keys(params);
    keys = keys.map(key => `"${key}"`);
    let values = Object.values(params);
    const query = `INSERT INTO admins (${keys.join(', ')})
    VALUES (${keys.map((_, index) => `$${index + 1}`).join(', ')})
    RETURNING *;
  `;
    const response = await pool.query(query, values);
    return response.rows[0];
  }


  //static async resetPassword(params) {
  // const _pass = passCom(_complexityOptions).validate(params.password); // password validation
  // if (_pass.error) {
  //   throw new CustomError(ERROR_CODES.PASS_RULES_ERROR);
  // }
  // const _tokenCheck = await ResetPasswordTokens.findOne({
  //   where: { token: params.token },
  //   raw: true,
  // });
  // if (!_tokenCheck) {
  //   throw new CustomError(ERROR_CODES.RESET_PASS_LINK_EXPIRED);
  // }
  // // verify the token
  // const _decodedToken = validatePasswordToken(params.token);
  // if (_decodedToken === 404)
  //   throw new CustomError(ERROR_CODES.RESET_PASS_LINK_EXPIRED);
  // const _profile = await Admin.findOne({
  //   where: { email: _decodedToken.email },
  //   raw: true,
  // });
  // if (!_profile) {
  //   throw new CustomError(ERROR_CODES.RESET_PASS_LINK_EXPIRED);
  // }
  // await ResetPasswordTokens.destroy({
  //   where: {
  //     email: _decodedToken.email,
  //   },
  // });
  // await Admin.update(
  //   {
  //     password: bcrypt.hashSync(params.password, bcrypt.genSaltSync(2)),
  //   },
  //   {
  //     where: {
  //       email: _decodedToken.email,
  //     },
  //   }
  // );
  //   return true;
  // }

  static async getByIndex(index, value) {
    const result = await pool.query(
      `SELECT * FROM admins WHERE "${index}" = $1`,
      [value]
    );
    if (result.rows.length === 0) return [];
    return result.rows;
  }

  static async updateById(id, array) {
    let columns = '';
    array.forEach((element) => {
      columns += `"${element.column}" = '${element.value}',`;
    });
    columns += `"updated_at" = '${DateTime.now().toFormat(
      'yyyy-MM-dd HH:mm:ss.SSS'
    )}'`;
    const query = `UPDATE admins SET ${columns} WHERE id = ${id}`;
    const result = await pool.query(
      query
    );
    return result;
  }

  static async deleteById(id) {
    const result = await pool.query(
      'DELETE FROM admins WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      throw new CustomError(ERROR_CODES.RECORD_NOT_FOUND);
    }
    return true;
  }
}
module.exports = { AdminDal };
