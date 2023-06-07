const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Todo = require("./models/Todo");
const dotenv = require("dotenv");
const morgan = require("morgan");
// const { application } = require("express");

dotenv.config();
const app = express();
app.use(morgan("common"));
app.use(express.json());
app.use(cors());
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch(console.error);

app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  // console.log(res);
  res.json(todos);
});

app.post("/todo/new", (req, res) => {
  try {
    const todo = new Todo({
      text: req.body.text,
    });

    console.log(todo);
    todo.save();

    res.json(todo);
  } catch (err) {
    console.log("some error occured while POST ", err);
  }
});

app.delete("/todo/delete/:id", async (req, res) => {
  try {
    const result = await Todo.findByIdAndDelete(req.params.id);
    res.json(result);
  } catch (err) {
    console.error("some error occured while deleting", err);
    res.json({});
  }
});

app.get("/todo/complete/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    todo.complete = !todo.complete;
    todo.save();
    res.json(todo);
  } catch (err) {
    console.error("some error occured while updating complete state", err);
  }
});

app.listen(3002, () => console.log("Connected to PORT 3002"));
