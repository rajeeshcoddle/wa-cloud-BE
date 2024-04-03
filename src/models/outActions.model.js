const mysqlConf = require("../../config/mysql.config");

const fetchOutActions = async () => {
  const db = mysqlConf.makeDb();
  try {
    const result = await db.query(
      "SELECT * FROM wac_out_actions order by id desc"
    );
    return result;
  } catch (error) {
    console.log("Error", error);
    return false;
  } finally {
    await db.close();
  }
};

module.exports = { fetchOutActions };
