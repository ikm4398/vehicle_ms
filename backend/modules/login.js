// modules/login.js
const axios = require("axios");

const BASE_URL = "http://pro.telemko.com/wialon/ajax.html";
const TOKEN =
  "21681804e33c8635d68a2c9b29581527440BBABCE32D4D9A9105C6F24BA75F2A3191037F";

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
