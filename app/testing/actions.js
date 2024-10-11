"use server";
import { S3, PutObjectCommand } from "@aws-sdk/client-s3";
export async function handleFormSubmit(currentState, formData) {
  const file = formData.get("my-file");
  // const folderName = formData.get('folder-name');
  const fileName = file?.name;
  const fileType = file?.type;
  // const uploadedImage = await uploadFileToS3(file, folderName);

  const binarrFile = await file.arrayBuffer();
  const fileBuffer = Buffer.from(binarrFile);

  const s3Client = new S3({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const params = {
    Bucket: "drivers-tracking",
    Key: fileName,
    Body: fileBuffer,
    ContentType: fileType,
  };

  try {
    const upload = await s3Client.send(new PutObjectCommand(params));
    console.log("File uploaded successfully:", upload);
    return {
      status: "success",
      message: `File ${fileName} uploaded successfully: ${upload}`,
    };
  } catch (err) {
    console.error("Error uploading file:", err);
    return {
      status: "error",
      message: "Error uploading file",
    };
  }
}
