const { Router } = require("express");
const blogRouter = Router();
const { Blog, User } = require("../models");
const { isValidObjectId } = require("mongoose");
const { commentRouter } = require("./commentRoute");

blogRouter.use("/:blogId/comment", commentRouter);

blogRouter.post("/", async (req, res) => {
  try {
    const { title, content, isLive, userId } = req.body;
    if (typeof title !== "string")
      return res.status(400).send({ err: "title is required" });
    if (typeof content !== "string")
      return res.status(400).send({ err: "content is required" });
    if (isLive && typeof isLive !== "boolean")
      return res.status(400).send({ err: "isLive must be a boolean" });
    if (!isValidObjectId(userId))
      return res.status({ err: "userId is invalid" });
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
    let { page = 0 } = req.query;
    page = parseInt(page);
    console.log({ page });
    const blogs = await Blog.find({})
      .sort({ updatedAt: -1 })
      .skip((page - 1) * 3)
      .limit(3);
    // .populate([
    //   { path: "user" },
    //   { path: "comments", populate: { path: "user" } },
    // ]);

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
    // const commentCount = await Comment.find({ blog: blogId }).countDocuments();
   
    return res.send({ blog, commentCount });
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
