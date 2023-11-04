const { BlobServiceClient, ContainerClient } = require("@azure/storage-blob");
const fs = require("fs");

const connectionString = "DefaultEndpointsProtocol=https;AccountName=signalstoragecontent;AccountKey=W2KtrfbEYkgE35Ei4TMRFGf8/BhODwSzjxAAamAly9SgLShyUayRKbt/D6v9tRiR+qK2dPOAhNFz+ASttDGWuQ==;EndpointSuffix=core.windows.net";

const containerName = "testimages";

const localFilePath = "mainlogo.png";

const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

const containerClient = blobServiceClient.getContainerClient(containerName);

async function createContainer() {
  await containerClient.create();
  console.log("Container created");
}

async function uploadImageToAzure() {
  try {
    const blobClient = containerClient.getBlobClient("mainlogo.png");
    const blockBlobClient = blobClient.getBlockBlobClient();
    const data = fs.readFileSync(localFilePath);
    await blockBlobClient.upload(data, data.length);

    console.log("Image uploaded successfully.");
  } catch (error) {
    console.error("Error uploading image:", error.message);
  }
}
createContainer().then(uploadImageToAzure);
