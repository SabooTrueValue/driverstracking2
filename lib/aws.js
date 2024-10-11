import AWS from "aws-sdk";
require("dotenv").config(); // Load environment variables from .env.local

// AWS configuration using environment variables
AWS.config.update({
  accessKeyId: "AKIA5QWKETV32NAMPGOF",
  secretAccessKey: "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",
  region: "ap-south-1",
  // accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  // secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  // region: process.env.AWS_REGION,
});

export const uploadFileToS3 = async (file, folderName) => {
  const params = {
    Bucket: "images-saboomaruti-in", // replace with your S3 bucket name
    Key: `${folderName}/${file.name}`, // include folder name in the path
    Body: file,
    ContentType: file.type,
  };

  const s3 = new AWS.S3();
console.log(s3)
  try {
    const data = await s3.upload(params).promise();
    console.log("File uploaded successfully:", data.Location);
    return data.Location; // Returns the URL of the uploaded file
  } catch (err) {
    console.error("Error uploading file:", err);
    throw err;
  }
};
