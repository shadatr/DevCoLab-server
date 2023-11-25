const mongoose = require("mongoose");
const multer = require("multer");
const Posts = mongoose.model("posts");
const Comment = mongoose.model("comments");
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

module.exports = (app) => {
  app.post("/api/post", upload.array("images"), async (req, res) => {
    const imagesArray = req.files.map((file) => file.buffer);
    const post = new Posts({
      _user: req.user.id,
      user_name:req.user.name,
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

  app.post("/api/post/comment", async (req, res) => {
    const comment = new Comment({
      _user: req.user.id,
      user_name: req.user.name,
      text: req.body.text,
      post_id: req.body.post_id,
    });

    await comment.save();
    res.status(201).send("Post saved successfully");
  });
  
  app.get("/api/post/:id/comments", async (req, res) => {
    const postId = req.params.id;

      const comments = await Comment.find({post_id:postId});
  
      if (!comments) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(comments);
  });
  
};
