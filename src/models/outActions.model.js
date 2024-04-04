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

const getExportDetail = async (userEmail) => {
  const db = mysqlConf.makeDb();
  try {
      const query = `SELECT ou.id, ou.username, ou.action, ou.task, t.tipo, t.note, ou.image_filename, ou.image_type_text, ou.plan_date, ou.result, ou.result_note, ou.status 
      FROM wac_out_actions ou 
      LEFT JOIN in_tasks t ON ou.task = t.cod_task
      JOIN wac_users ur ON t.id_user = ur.id
      WHERE t.tipo = 'INSTALLAZIONE' 
      AND ur.email = ?`;

    let result = await db.query({
      sql: query,
      values: [userEmail],
    });
      return result;
  } catch (error) {
      console.log("Error", error);
      return false;
  } finally {
      await db.close();
  }
};

module.exports = { fetchOutActions, getExportDetail };
