const ERROR_CODES = require('../constant/error-messages');
const CustomError = require('../utils/error');
const pool = require('../utils/database');

class CompanyDal {
  static async register(params) {
    const { name, address, type } = params;
    const result = await pool.query(
      `INSERT INTO companies ("name", "address", "type") VALUES ($1, $2, $3) RETURNING *`,
      [name, address, type]
    );
    return result.rows[0];
  }

  static async getCompeniesInfo() {
    const result = await pool.query('SELECT * FROM companies');
    return result.rows;
  }

  static async getByIndex(index, value) {
    const result = await pool.query(
      `SELECT * FROM companies WHERE "${index}" = $1`,
      [value]
    );
    if (result.rows.length === 0) return [];
    return result.rows[0];
  }

  static async deleteById(id) {
    const result = await pool.query(
      'DELETE FROM companies WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      throw new CustomError(ERROR_CODES.RECORD_NOT_FOUND);
    }
    return true;
  }
}
module.exports = { CompanyDal };
