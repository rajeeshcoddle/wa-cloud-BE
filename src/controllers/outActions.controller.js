const outActionsModel = require("../models/outActions.model");
const config = require("config");
const storage = require("../../config/storage-azure");

const getOutActions = async (req, res) => {
  try {
    let outActons = await outActionsModel.fetchOutActions();
    if (!outActons) {
      res.status(500).send("Error fetching out actions");
    }
    return res.status(200).json(outActons);
  } catch (error) {
    console.log("error", error);
    return res.status(500).send("Internal Server Error");
  }
};

const getImage = async (req, res) => {
  try {
    const containerName = config.AZURE_CONTAINER_NAME;
    const blobName = req.query.blobName;
    console.log("blobName", blobName);
    const url = await storage.generateSasToken(containerName, blobName);
    return res.status(200).json({ url });
  } catch (error) {
    console.error("Error fetching image valid url:", error);
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = { getOutActions, getImage };
