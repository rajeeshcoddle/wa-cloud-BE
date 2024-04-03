const mysqlConf = require("../../config/mysql.config");

const getUserRole = async (userEmail) => {
  const db = mysqlConf.makeDb();
  try {
    const query = `SELECT ur.role AS user_role, u.isadmin
      FROM setup_users u
      LEFT JOIN setup_users_roles ur ON
      ur.user_id = u.id WHERE u.username = ?`;

    let result = await db.query({
      sql: query,
      values: [userEmail],
      timeout: 900000,
    });
    return result;
  } catch (err) {
    console.log(err);
    return false;
  } finally {
    await db.close();
  }
};

const getUser = async (userEmail) => {
  const db = mysqlConf.makeDb();
  try {
    const query = `SELECT *
      FROM setup_users
      WHERE username = ?`;
    let result = await db.query({
      sql: query,
      values: [userEmail],
      timeout: 900000,
    });
    return result;
  } catch (err) {
    console.log(err);
    return false;
  } finally {
    await db.close();
  }
};

module.exports = { getUserRole, getUser };
