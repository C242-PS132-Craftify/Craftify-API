const express = require("express");
const blogController = require("../controllers/blogController");
const router = express.Router();

router.get("/", blogController.getAllBlogs);
router.post("/", blogController.createBlog);
router.get("/:id", blogController.getBlogById);
router.put("/:id", blogController.updateBlog);
router.delete("/:id", blogController.deleteBlog);

module.exports = router;
