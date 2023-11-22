const mongoose = require("mongoose");
const multer = require("multer");
const Posts = mongoose.model("posts");
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

module.exports = (app) => {
  app.post("/api/post", upload.array("images"), async (req, res) => {
    const imagesArray = req.files.map((file) => file.buffer);
    const post = new Posts({
      _user: req.user.id,
      user_name: req.user.name,
      text: req.body.text,
      images: imagesArray,
    });

    await post.save();
    res.status(201).send("Post saved successfully");
  });

  app.get("/api/posts", async (req, res) => {
    const allPosts = await Posts.find();
    res.send(allPosts);
  });

  app.get("/api/post/:id", async (req, res) => {
    const postId = req.params.id;

      const post = await Posts.findById(postId);
  
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
  
      res.json(post);
  
  });
  
};
