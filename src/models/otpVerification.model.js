const mysqlConf = require("../../config/mysql.config");

const checkUserExist = async (email) => {
  const db = mysqlConf.makeDb();
  try {
    const result = await db.query(
      `SELECT id, name from setup_users WHERE username = ?;`,
      [email]
    );
    return result[0];
  } catch (err) {
    console.log(err);
    return false;
  } finally {
    await db.close();
  }
};

const saveOtp = async (userId, otp) => {
  const db = mysqlConf.makeDb();
  try {
    const result = await db.query(
      `UPDATE setup_users SET otp = ?, otp_created_time = CURRENT_TIMESTAMP WHERE id = ?;`,
      [otp, userId]
    );
    return result;
  } catch (err) {
    console.log(err);
    return false;
  } finally {
    await db.close();
  }
};

const verifyOtp = async (email, otp) => {
  const db = mysqlConf.makeDb();
  try {
    const result = await db.query(
      `SELECT id, name, otp_created_time, CURRENT_TIMESTAMP() as currentTime from setup_users WHERE username = ? and otp = ?;`,
      [email, otp]
    );
    return result[0];
  } catch (err) {
    console.log(err);
    return false;
  } finally {
    await db.close();
  }
};

const getUserRole = async (email) => {
  const db = mysqlConf.makeDb();
  try {
    const result = await db.query(
      `SELECT ur.role AS user_role, u.isadmin 
      FROM setup_users u
      LEFT JOIN setup_users_roles ur ON
      ur.user_id = u.id WHERE u.username = ?;`,
      [email]
    );
    return result;
  } catch (err) {
    console.log(err);
    return false;
  } finally {
    await db.close();
  }
};

module.exports = {
  checkUserExist,
  saveOtp,
  verifyOtp,
  getUserRole,
};
