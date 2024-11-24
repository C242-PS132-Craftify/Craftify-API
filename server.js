const express = require("express");
const bodyParser = require("body-parser");
const blogRoutes = require("./routes/blogRoutes");
const uploadRouter = require("./routes/upload");

const app = express();
app.use(bodyParser.json());

// Routes
app.use("/blog", blogRoutes);
app.use("/upload", uploadRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
