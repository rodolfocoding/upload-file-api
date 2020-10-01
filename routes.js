const express = require("express");
const FileController = require("./controller/FileController");
const multer = require("multer");

const routes = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "C:/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

routes.post("/upload", upload.single("file"), FileController.store);
routes.post("/file", FileController.delete);
routes.get("/file", FileController.index);
routes.get("/download/:fileDownload", FileController.download);
routes.get("/searchFile", FileController.findByExt);

module.exports = routes;
