
const { Storage } = require("@google-cloud/storage");


const storage = new Storage({
  keyFilename: "./keys/bucket-upload-key.json", 
});

const bucketName = "item-uploaded-bucket"; 

const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    const bucket = storage.bucket(bucketName);
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream();

    blobStream.on("error", (err) => {
      return res.status(500).send("Error uploading file: " + err.message);
    });

    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
      return res.status(200).send({
        message: "File uploaded successfully",
        url: publicUrl,
      });
    });

    blobStream.end(req.file.buffer); 
  } catch (err) {
    return res.status(500).send("Error uploading file: " + err.message);
  }
};

module.exports = { uploadImage }; 
