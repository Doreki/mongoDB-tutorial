const { Router } = require("express");
const userRouter = Router();
const { User, Blog } = require("../models");
const mongoose = require("mongoose");

userRouter.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    return res.send({ users });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

userRouter.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ err: "Invalid userId" });
    const user = await User.findOne({ _id: userId });
    return res.send({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

userRouter.post("/", async (req, res) => {
  try {
    let { username, name } = req.body;
    if (!username) return res.status(400).send({ err: "username is required" });
    if (!name || !name.first || !name.last)
      return res.status(400).send({
        err: "Both first and last names are required",
      });

    const user = new User(req.body);
    await user.save();
    return res.send({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});
userRouter.delete("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ err: "Invalid userId" });
    const [user] = await Promise.all([
      User.findOneAndDelete({ _id: userId }),
      Blog.deleteMany({ "user._id": userId }),
      Blog.updateMnay(
        { "comments.user": userId },
        { $pull: { commnts: { user: userId } } }
      ),
      Comment.deleteMany({ user: userId }),
    ]);

    return res.send({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

userRouter.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ err: "Invalid userId" });
    if (!age && !name)
      return res.status(400).send({ err: "age or name is required" });
    const { age, name } = req.body;
    if (age && typeof age !== "number")
      return res.status(400).send({ err: "age is required" });
    if (name && typeof name.first !== "string" && typeof name.last !== "string")
      return res
        .status(400)
        .send({ err: "first and last name must be strings" });
    if (typeof age !== "number")
      return res.status(400).send({ err: "age must be a number" });

    // let updateBody = {};
    // if (age) updateBody.age = age;
    // if (name) updateBody.name = name;

    // const user = await User.findByIdAndUpdate(
    //   userId,
    //   { age, name },
    //   { new: true }
    // );
    let user = await User.findById(userId);
    console.log({ userBeforeEdit: user });
    if (age) user.age = age;
    if (name) {
      user.name = name;
      await Promise.all([
        Blog.updateMany({ "user._id": userId }, { "user.name": name }),
        Blog.updateMany(
          {},
          { "comments.$[comment].userFullName": `${name.first} ${name.last}` },
          { arrayFilters: [{ "comment.user": userId }] }
        ),
      ]);
    }
    await user.save();
    console.log({ userAfterEdit: user });
    return res.send({ user });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ err: err.message });
  }
});

module.exports = {
  userRouter,
};
