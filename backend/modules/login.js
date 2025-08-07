// modules/login.js
const axios = require("axios");

const BASE_URL = process.env.W_URL;
const TOKEN = process.env.W_ACCESS_TOKEN;

async function loginWithToken() {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        svc: "token/login",
        params: JSON.stringify({ token: TOKEN }),
      },
    });

    if (response.data && response.data.eid) {
      return response.data.eid;
    } else {
      throw new Error("Invalid response from token/login");
    }
  } catch (error) {
    console.error("Login error:", error.response?.data);

    throw error;
  }
}

module.exports = loginWithToken;
