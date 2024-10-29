import aws from "aws-sdk";
require("dotenv").config(); // Load environment variables from .env.local

// AWS configuration using environment variables
aws.config.update({
  region: "ap-south-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  // region: process.env.AWS_REGION,
});

// export const uploadFileToS3 = async (file, folderName) => {
//   const params = {
//     Bucket: "drivers-tracking", // replace with your S3 bucket name
//     Key: `${folderName}/${file.name}`, // include folder name in the path
//     Body: file.buffer,
//     // ContentType: file.type,
//     ACL: "public-read",
//   };

//   const s3 = new AWS.S3();
//   console.log(s3);
//   try {
//     const data = await s3.upload(params).promise();
//     console.log("File uploaded successfully:", data.Location);
//     return data.Location; // Returns the URL of the uploaded file
//   } catch (err) {
//     console.error("Error uploading file:", err);
//     throw err;
//   }
// };

let uploadFile = async (file) => {
  return new Promise(function (resolve, reject) {
    let s3 = new aws.S3({ apiVersion: "2006-03-01" });

    var uploadParams = {
      ACL: "public-read",
      Bucket: "drivers-tracking",
      Key: "abc/" + file.name,
      Body: file.buffer,
    };

    s3.upload(uploadParams, function (err, data) {
      if (err) {
        return reject({ error: err });
      }

      console.log("file uploaded succesfully");
      return resolve(data.Location);
    });
  });
};
module.exports.uploadFile = uploadFile;
