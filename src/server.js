const express = require("express");
const app = express();
const { userRouter, blogRouter } = require("./routes");
const { mongoose } = require("mongoose");
const { commentRouter } = require("./routes/commentRoute");
const MONGO_URI =
  "mongodb+srv://admin:qwer1234@cluster0.nn1apzs.mongodb.net/BlogService?retryWrites=true&w=majority";

const server = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    mongoose.set("debug", true);
    console.log("MongoDB coneected");
    app.use(express.json());

    app.use("/user", userRouter);
    app.use("/blog", blogRouter);

    app.listen(3000, () => {
      console.log("server listening on port 3000");
    });
  } catch (err) {
    console.log(err);
  }
};

server();
