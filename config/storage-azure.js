const {
  BlobServiceClient,
  BlobSASPermissions,
  generateBlobSASQueryParameters,
  StorageSharedKeyCredential,
} = require("@azure/storage-blob");
const config = require("config");

// generateSasToken
async function generateSasToken(containerName, blobName) {
  const connectionString = config.AZURE_STORAGE_CONNECTION_STRING;
  const accountName = config.AZURE_STORAGE_ACCOUNT_NAME;
  const accountKey = config.AZURE_STORAGE_ACCOUNT_KEY;
  // Create a BlobServiceClient object
  const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString);
  const sharedKeyCredential = new StorageSharedKeyCredential(
    accountName,
    accountKey
  );
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(blobName);

  const sasToken = generateBlobSASQueryParameters(
    {
      containerName,
      blobName,
      permissions: BlobSASPermissions.parse("racwd"),
      startsOn: new Date(),
      expiresOn: new Date(new Date().valueOf() + 86400),
    },
    sharedKeyCredential
  ).toString();
  return `${blobClient.url}?${sasToken}`;
}

// Function to upload a file to Azure Blob Storage
async function uploadFile(containerName, blobName, filePath) {
  const connectionString = config.AZURE_STORAGE_CONNECTION_STRING;
  // Create a BlobServiceClient object
  const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.uploadFile(filePath);
  console.log(`File "${filePath}" uploaded successfully.`);
}

async function uploadImageToAzure(containerName, blobName, imageData) {
  const connectionString = config.AZURE_STORAGE_CONNECTION_STRING;
  // Create a BlobServiceClient object
  const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.upload(imageData, imageData.length);
  console.log(`File "${blobName}" uploaded successfully.`);
}

// Function to download a file from Azure Blob Storage
async function downloadFile(containerName, blobName, downloadPath) {
  const connectionString = config.AZURE_STORAGE_CONNECTION_STRING;
  // Create a BlobServiceClient object
  const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.downloadToFile(downloadPath);
  console.log(`File "${blobName}" downloaded successfully.`);
}

// Function to delete a file from Azure Blob Storage
async function deleteFile(containerName, blobName) {
  const connectionString = config.AZURE_STORAGE_CONNECTION_STRING;
  // Create a BlobServiceClient object
  const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.delete();
  console.log(`File "${blobName}" deleted successfully.`);
}

// Function to update a file in Azure Blob Storage
async function updateFile(containerName, blobName, filePath) {
  const connectionString = config.AZURE_STORAGE_CONNECTION_STRING;
  // Create a BlobServiceClient object
  const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);
  await blockBlobClient.uploadFile(filePath, { overwrite: true });
  console.log(`File "${blobName}" updated successfully.`);
}

async function appendToBlob(containerName, blobName, contentToAppend) {
  const connectionString = config.AZURE_STORAGE_CONNECTION_STRING;
  // Create a BlobServiceClient object
  const blobServiceClient =
    BlobServiceClient.fromConnectionString(connectionString);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobClient = containerClient.getBlobClient(blobName);
  const blockBlobClient = blobClient.getBlockBlobClient();

  let existingContent = "";

  // Check if the blob exists
  if (await blobClient.exists()) {
    // Download the existing content
    const downloadBlockBlobResponse = await blobClient.download();
    const downloadedContent = await streamToString(
      downloadBlockBlobResponse.readableStreamBody
    );
    existingContent = downloadedContent;
  }

  // Append new content
  const updatedContent = existingContent + contentToAppend;

  // Upload the updated content
  const uploadBlobResponse = await blockBlobClient.upload(
    updatedContent,
    updatedContent.length
  );
  console.log(`Upload block blob response: ${uploadBlobResponse.requestId}`);
}

// A helper function used to read a readable stream into a string
async function streamToString(readableStream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    readableStream.on("data", (data) => {
      chunks.push(data.toString());
    });
    readableStream.on("end", () => {
      resolve(chunks.join(""));
    });
    readableStream.on("error", reject);
  });
}

module.exports = {
  uploadFile,
  downloadFile,
  deleteFile,
  updateFile,
  appendToBlob,
  uploadImageToAzure,
  generateSasToken,
};
