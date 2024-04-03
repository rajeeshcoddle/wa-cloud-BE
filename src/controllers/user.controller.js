const { sendResponse } = require("../utilities/handleResponse");
const userModel = require("../models/user.model");

const fetchUserRole = async (req, res) => {
  try {
    if (!req.headers.useremail) {
      let errorMsg = "Email Id is missing";
      return sendResponse(res, errorMsg, 500);
    }

    let userEmail = req.headers.useremail;
    let userDetails = await userModel.getUser(userEmail);
    if (!Array.isArray(userDetails) || userDetails.length === 0) {
      return sendResponse(res, "User not found", 500);
    }
    let getUserRole = await userModel.getUserRole(userEmail);

    if (!Array.isArray(getUserRole) || getUserRole.length === 0) {
      let errMsg = "Error while getting user roles";
      return sendResponse(res, errMsg, 500);
    }

    let roleArray = [];
    for (let value of getUserRole) {
      let user_role = value.user_role;
      if (user_role) {
        user_role = user_role.trim();
        roleArray.push(user_role);
      }
    }
    let isAdmin = getUserRole[0]?.isadmin;
    if (isAdmin === 1) {
      roleArray.push("ADMIN");
    }
    let result = { roleArray: roleArray };
    let message = `Successfully fetched user roles`;
    return sendResponse(res, message, 200, result);
  } catch (error) {
    console.log(error);
    let errMsg = "Error while getting user roles";
    return sendResponse(res, errMsg, 500);
  }
};

module.exports = { fetchUserRole };
