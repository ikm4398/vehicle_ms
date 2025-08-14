const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  getAllDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
} = require("../controllers/driverController");

// Multer file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/drivers/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/", getAllDrivers);

router.post(
  "/",
  upload.fields([
    { name: "licenseAttachment", maxCount: 1 },
    { name: "citizenshipFront", maxCount: 1 },
    { name: "citizenshipBack", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]),
  createDriver
);

router.put(
  "/:id",
  upload.fields([
    { name: "licenseAttachment", maxCount: 1 },
    { name: "citizenshipFront", maxCount: 1 },
    { name: "citizenshipBack", maxCount: 1 },
    { name: "photo", maxCount: 1 },
  ]),
  updateDriver
);

router.delete("/:id", deleteDriver);

module.exports = router;
