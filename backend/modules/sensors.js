// modules/sensors.js
const axios = require("axios");
const getSid = require("./sidManager");

const BASE_URL = "http://pro.telemko.com/wialon/ajax.html";

async function fetchSensorValues(unitId, sensorIds = [], flags = 1) {
  const sid = await getSid();

  const params = {
    unitId: unitId,
    flags: flags,
  };

  if (sensorIds.length > 0) {
    params.sensors = sensorIds;
  }

  const response = await axios.get(BASE_URL, {
    params: {
      svc: "unit/calc_last_message",
      sid: sid,
      params: JSON.stringify(params),
    },
  });
  console.log("hello");
  return response.data;
}

module.exports = fetchSensorValues;
