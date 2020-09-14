const { db } = require("../database");
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const config = require("../configs/configs");
app.set("key", config.key);

async function addTodoDay(req) {
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

      let alreadyExist = false;
      let response;
      let responseDelete;
      let idDelete;

      const responseCalendar = await db
        .ref(`Calendar/Users/${req.body.email}`)
        .once("value", (data) => {
          return data.val();
        });
      const resData = responseCalendar.val();
      if (resData !== null) {
        for (const key in resData) {
          const id = resData[key].id.id;
          if (id === req.body.id.id) {
            if (resData[key].day === req.body.day) {
              if (resData[key].month === req.body.month) {
                alreadyExist = true;
                idDelete = key;
              }
            }
          }
        }
      }
      if (alreadyExist) {
        responseDelete = await db
          .ref(`Calendar/Users/${req.body.email}/${idDelete}`)
          .remove();
        return {
          status: 204,
        };
      } else {
        response = await db
          .ref(`Calendar/Users/${req.body.email}`)
          .push(req.body);
        return {
          status: 200,
        };
      }
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

async function setDayTodo(req) {
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

        const calendarList = await db
          .ref(`Calendar/Users/${req.body.email}`)
          .once("value", (data) => {
            return data.val();
          });
        return calendarList.val();
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

const calendarFunctions = {
  addTodoDay,
  setDayTodo,
};

module.exports = calendarFunctions;
