const mongoose = require("mongoose");
const { Binary } = require("mongodb");
const multer = require("multer");
const upload = multer();

const Posts = mongoose.model("posts");

module.exports = (app) => {
  app.post("/api/post", upload.array("images"), async (req, res) => {
    try {
      const post = new Posts({
        _user: req.user.id,
        user_name: req.user.name,
        text: req.body.text,
      });

      if (req.files && req.files.length > 0) {
        const binaryPictures = req.files.map(
          (file) => new Binary(file.buffer, Binary.SUBTYPE_BINARY)
        );
        post.images = binaryPictures;
      }

      console.log(post);
      await post.save();

      res.status(201).send("Post saved successfully");
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });

  app.get("/api/posts", async (req, res) => {
    const allPosts = await Posts.find();
    res.send(allPosts);
  })
};
