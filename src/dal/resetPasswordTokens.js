const ERROR_CODES = require('../constant/error-messages');
const CustomError = require('../utils/error');
const pool = require('../utils/database');
const { DateTime } = require('luxon');

class ResetPasswordTokensDal {
  static async create(params) {
    let keys = Object.keys(params);
    keys = keys.map(key => `"${key}"`);
    const values = Object.values(params);
    const query = `INSERT INTO resetpasswordtokens (${keys.join(', ')})
    VALUES (${keys.map((_, index) => `$${index + 1}`).join(', ')})
    RETURNING *;
  `;
    const response = await pool.query(query, values);
    return response.rows[0];
  }

  static async getByIndex(index, value) {
    const result = await pool.query(
      `SELECT * FROM resetpasswordtokens WHERE "${index}" = $1`,
      [value]
    );
    if (result.rows.length === 0) return [];
    return result.rows;
  }

  static async updateById(id, array) {
    let columns = '';
    array.forEach((element) => {
      columns += `"${element.column}" = '${element.value}', `;
    });
    columns += `"updated_at" = '${DateTime.now().toFormat(
      'yyyy-MM-dd HH:mm:ss.SSS'
    )}'`;
    const query = `UPDATE resetpasswordtokens SET ${columns} WHERE id = ${id}`;
    const result = await pool.query(query);
    return result;
  }

  static async deleteById(id) {
    const result = await pool.query(
      'DELETE FROM resetpasswordtokens WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      throw new CustomError(ERROR_CODES.RECORD_NOT_FOUND);
    }
    return true;
  }
}
module.exports = { ResetPasswordTokensDal };
