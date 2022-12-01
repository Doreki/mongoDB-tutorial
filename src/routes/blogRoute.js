const { Router } = require("express");
const blogRouter = Router();
const { Blog } = require("../models/Blog");
const { User } = require("../models/User");
const { isValidObjectId } = require("mongoose");

blogRouter.post("/", async (req, res) => {
  try {
    const { title, content, isLive, userId } = req.body;
    if (typeof title !== "string")
      res.status(400).send({ err: "title is required" });
    if (typeof content !== "string")
      res.status(400).send({ err: "content is required" });
    if (isLive && isLive !== "Boolean")
      res.status(400).send({ err: "isLive must be a boolean" });
    if (!isValidObjectId(userId)) res.status({ err: "userId is invalid" });
    let user = await User.findById(userId);
    if (!user) res.status(400).send({ err: "user does not exist" });

    let blog = new Blog({ ...req.body, user });
    await blog.save();
    return res.send({ blog });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

blogRouter.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find({});
    return res.send({ blogs });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

blogRouter.get("/:blogId", async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId)) res.status({ err: "blogId is invalid" });
    let user = await User.findById(blogId);

    const blog = await Blog.findOne({ _id: blogId });
    return res.send({ blog });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

blogRouter.put("/:blogId", async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId)) res.status({ err: "userId is invalid" });
    let user = await User.findById(userId);
    const { title, content } = req.body;
    if (typeof title !== "string")
      res.status(400).send({ err: "title is required" });
    if (typeof content !== "string")
      res.status(400).send({ err: "content is required" });

    const blog = await Blog.findOneAndUpdate(
      { _id: blogId },
      { title, content },
      { new: true }
    );

    return res.send({ blog });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

blogRouter.patch("/:blogId/live", async (req, res) => {
  try {
    const { blogId } = req.params;
    if (!isValidObjectId(blogId)) res.status({ err: "userId is invalid" });

    const { isLive } = req.body;
    if (typeof isLive !== "boolean")
      res.status(400).send({ err: "boolean isLive is required" });

    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { isLive },
      { new: true }
    );

    return res.send({ blog });
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

blogRouter.delete("/:blogId", async (req, res) => {
  try {
  } catch (err) {
    console.log(err);
    res.status(500).send({ err: err.message });
  }
});

module.exports = { blogRouter };
