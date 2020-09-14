require("dotenv").config();
const express = require("express");
const app = express();
const config = require("./configs/configs");
const cors = require("cors");

const {
  getTodoList,
  addTodoList,
  deleteTodoList,
} = require("./Controller/ControllerList");

const { signUser, loginUser } = require("./Controller/ControllerUser");

const { addTodoDay, setDayTodo } = require("./Controller/ControllerCalendar");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const port = process.env.PORT;

app.set("key", config.key);

app.listen({ port }, () => {
  app.post("/fetchTodoList", async (req, res) => {
    try {
      res.send(await getTodoList(req));
    } catch (e) {
      throw new Error(e.message);
    }
  });
  app.post("/addTodoList", async (req, res) => {
    try {
      const response = await addTodoList(req);
      res.send(response);
    } catch (e) {
      throw new Error(e.message);
    }
  });
  app.post("/deleteTodoList", async (req, res) => {
    try {
      res.send(await deleteTodoList(req));
    } catch (e) {
      throw new Error(e.message);
    }
  });
  app.post("/addTodoDay", async (req, res) => {
    try {
      res.send(await addTodoDay(req));
    } catch (e) {
      throw new Error(e.message);
    }
  });
  app.post("/fetchDaysTodo", async (req, res) => {
    try {
      res.send(await setDayTodo(req));
    } catch (e) {
      throw new Error(e.message);
    }
  });
  app.post("/signUser", async (req, res) => {
    res.send(await signUser(req.body));
  });
  app.post("/loginUser", async (req, res) => {
    res.send(await loginUser(req.body));
  });
});
