const { db } = require("../database");
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const config = require("../configs/configs");
app.set("key", config.key);

async function signUser(userInfo) {
  try {
    const responseUser = await db
      .ref("Users")
      .orderByChild("email")
      .equalTo(userInfo.email)
      .once("value", (data) => {
        return data.val();
      });
    if (responseUser.val() === null) {
      const response = await db.ref(`Users`).push(userInfo);
      return response;
    } else {
      throw new Error("Email Already Exists");
    }
  } catch (e) {
    throw new Error(e.message);
  }
}

async function loginUser(body) {
  try {
    const response = await db
      .ref("Users")
      .orderByChild("email")
      .equalTo(body.email)
      .once("value", (data) => {
        return data.val();
      });
    if (response.val() !== null) {
      var key = Object.keys(response.val())[0];
      var formattedPassword = response.val()[`${key}`].password;
      if (formattedPassword === body.password) {
        const payload = {
          check: true,
        };
        const token = jwt.sign(payload, app.get("key"), {
          expiresIn: 1440,
        });
        return {
          mensaje: "Autorizacion Correcta",
          token: token,
          status: 200,
        };
      } else {
        return { mensaje: "Usuario o contraseña incorrecta", status: 500 };
      }
    }
  } catch (e) {
    throw new Error(e.message);
  }
}

const userFunctions = {
  loginUser,
  signUser,
};

module.exports = userFunctions;
