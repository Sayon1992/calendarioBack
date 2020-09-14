const { db } = require("../database");
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const config = require("../configs/configs");
app.set("key", config.key);

async function getTodoList(req) {
  try {
    const token = req.headers["access-token"];
    if (
      token !== "undefined" &&
      token !== "" &&
      token !== null &&
      token !== undefined
    ) {
      try {
        jwt.verify(token, app.get("key"), (err, decoded) => {
          if (err) {
            return {
              message: "Token Invalida",
            };
          } else {
            req.decoded = decoded;
          }
        });

        const list = await db
          .ref(`List/Users/${req.body.email}`)
          .once("value", (data) => {
            return data.val();
          });
        return list.val();
      } catch (e) {
        throw new Error(e.message);
      }
    } else {
      return {
        message: "Token No Proveída",
      };
    }
  } catch (e) {
    throw new Error(e.message);
  }
}

async function addTodoList(req) {
  try {
    const token = req.headers["access-token"];
    if (
      token !== "undefined" &&
      token !== "" &&
      token !== null &&
      token !== undefined
    ) {
      jwt.verify(token, app.get("key"), (err, decoded) => {
        if (err) {
          return {
            message: "Token Invalida",
            status: 500,
          };
        } else {
          req.decoded = decoded;
        }
      });

      const todo = req.body.todo;

      const response = await db.ref(`List/Users/${req.body.email}`).push(todo);

      console.log(response.path);

      return {
        status: 200,
        id: response.path.pieces_[3],
        todo,
      };
    } else {
      return {
        message: "Token No Proveída",
        status: 500,
      };
    }
  } catch (e) {
    throw new Error(e.message);
  }
}

async function deleteTodoList(req) {
  try {
    const token = req.headers["access-token"];
    if (
      token !== "undefined" &&
      token !== "" &&
      token !== null &&
      token !== undefined
    ) {
      jwt.verify(token, app.get("key"), (err, decoded) => {
        if (err) {
          return {
            message: "Token Invalida",
            status: 500,
          };
        } else {
          req.decoded = decoded;
        }
      });

      const id = req.body.id;
      const email = req.body.email;

      console.log(email);

      const response = await db.ref(`List/Users/${email}/${id}`).remove();

      return {
        status: 200,
        response,
        id,
      };
    } else {
      return {
        message: "Token No Proveída",
        status: 500,
      };
    }
  } catch (e) {
    throw new Error(e.message);
  }
}

const todoListFunctions = {
  getTodoList,
  addTodoList,
  deleteTodoList,
};

module.exports = todoListFunctions;
