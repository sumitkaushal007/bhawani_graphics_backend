const express = require("express");
const router = express.Router();
const {authMiddleware, checkRole} = require('../middleware/auth.js');
const upload = require("../middleware/upload.js");
const {uploadFiles, getAllFiles} = require("../controllers/fileController");

// router.use(authMiddleware);
// router.use(checkRole(["admin"]));

router.get("/", getAllFiles);

router.put("/upload", upload.array("files", 10), uploadFiles);


module.exports = router;
