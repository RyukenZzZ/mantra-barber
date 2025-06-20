require("dotenv").config(); // To enable .env called
const express = require("express"); // Import express with non-module
require("express-async-errors");
const cors = require("cors");
const fileUpload = require("express-fileupload"); // This package is to enable req.files
const router = require("./routes");
const { errorHandler, notFoundURLHandler } = require("./middlewares/errors");
const cron = require('node-cron');
const autoCancelExpiredBookings = require('./cron/autoCancelBookings');

/* Make/initiate expess application */
const app = express();
const port = process.env.PORT || 3000;

// Jalankan cron setiap 1 menit
cron.schedule('* * * * *', async () => {
    console.log('Running auto-cancel cron...');
    await autoCancelExpiredBookings();
  });

/* Enable CORS */
app.use(cors());

/* We need to activate body parser/reader (req.body) */
app.use(express.json());

/* We need to read form-body (body parser/reader) (req.files) if you want upload file */
app.use(
    fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
    })
);

app.get("/", (req, res) => {
  res.status(200).json({ message: "ping successfully" });
});

// All routes define here
app.use("/", router);

// This function is for 404 handle URL
app.use("*", notFoundURLHandler);

// This function is to handle error when API hit, it always be the last middleware
app.use(errorHandler);

/* Run the express.js application */
app.listen(port, () => {
    console.log(`The express.js app is runing on port ${port}`);
});