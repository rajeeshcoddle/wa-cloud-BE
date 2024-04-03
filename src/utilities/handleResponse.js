const sendResponse = async (res, message, status, data = {}) => {
  const responseData = new Object();
  responseData.success = status === 200;
  responseData.message = message;
  if (status === 200 && Object.keys(data).length > 0) {
    for (let key in data) {
      responseData[key] = data[key];
    }
  }
  return res.json(responseData).status(status);
};

module.exports = { sendResponse };
