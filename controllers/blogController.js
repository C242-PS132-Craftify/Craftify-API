const { db } = require("../config/firebaseConfig");
const admin = require("firebase-admin"); // Importing admin for using Timestamp

// Fetch all blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const snapshot = await db.collection("blog").get();
    if (snapshot.empty) {
      return res.status(404).json({ error: "No blog posts found" });
    }
    const blogs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error); // Log the error
    res.status(500).json({ error: "Failed to fetch blog posts" });
  }
};

// Create a new blog
exports.createBlog = async (req, res) => {
  const { title, author, content, header_image } = req.body;

  // Validate that all required fields are provided
  if (!title || !author || !content || !header_image) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Further validation for field types
  if (
    typeof title !== "string" ||
    typeof author !== "string" ||
    typeof content !== "string" ||
    typeof header_image !== "string"
  ) {
    return res.status(400).json({ error: "All fields must be strings" });
  }

  try {
    const newBlog = {
      title,
      author,
      content,
      header_image,
      createdAt: admin.firestore.Timestamp.now(), // Using Firebase's Timestamp
    };

    // Add the new blog to the Firestore collection
    const docRef = await db.collection("blog").add(newBlog);
    res.status(201).json({ id: docRef.id, ...newBlog }); // Return the blog post with id
  } catch (error) {
    console.error("Error creating blog:", error); // Log the error
    res.status(500).json({ error: "Failed to create blog post" });
  }
};

// Fetch a single blog by ID
exports.getBlogById = async (req, res) => {
  const blogId = req.params.id;

  // Log the ID of the blog post being fetched
  console.log(`Fetching blog post with ID: ${blogId}`);

  try {
    // Fetch the document from Firestore
    const doc = await db.collection("blog").doc(blogId).get();

    // Check if the document exists
    if (!doc.exists) {
      console.log(`Blog post with ID ${blogId} not found.`);
      return res.status(404).json({ error: "Blog post not found" });
    }

    // Log the data of the fetched blog post
    console.log("Fetched blog post data:", doc.data());

    // Return the blog post data as response
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    // Log any errors that occur during the process
    console.error(`Error fetching blog post with ID ${blogId}:`, error);
    res.status(500).json({ error: "Failed to fetch blog post" });
  }
};

// Update a blog post by ID
exports.updateBlog = async (req, res) => {
  const blogId = req.params.id;

  try {
    const docRef = db.collection("blog").doc(blogId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    // Update the blog post with the new data
    await docRef.update(req.body);
    res.status(200).json({ id: blogId, ...req.body });
  } catch (error) {
    console.error("Error updating blog:", error); // Log the error
    res.status(500).json({ error: "Failed to update blog post" });
  }
};

// Delete a blog post by ID
exports.deleteBlog = async (req, res) => {
  const blogId = req.params.id;

  try {
    const docRef = db.collection("blog").doc(blogId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    // Delete the blog post from Firestore
    await docRef.delete();
    res.status(200).json({ message: `Blog post with ID ${blogId} deleted.` });
  } catch (error) {
    console.error("Error deleting blog:", error); // Log the error
    res.status(500).json({ error: "Failed to delete blog post" });
  }
};
