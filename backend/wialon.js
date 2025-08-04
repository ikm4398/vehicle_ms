const axios = require("axios");

const BASE_URL = "http://pro.telemko.com/wialon/ajax.html";
const TOKEN =
  "7c139d3403d49ea07141105256aae6884E52E2281695E3BC410D8D1CB6A86CDC9E9E66B0";

let sid = null;
let sidExpiresAt = 0;

async function refreshSid() {
  try {
    const res = await axios.get(BASE_URL, {
      params: {
        svc: "token/login",
        params: JSON.stringify({ token: TOKEN }),
      },
    });

    sid = res.data.eid;
    sidExpiresAt = Date.now() + 4.5 * 60 * 1000; // 4.5 minutes validity buffer
    console.log("SID refreshed:", sid);
    return sid;
  } catch (err) {
    console.error("Failed to get SID:", err.response?.data || err.message);
    sid = null;
    sidExpiresAt = 0;
    throw err;
  }
}

async function getSid() {
  if (!sid || Date.now() > sidExpiresAt) {
    await refreshSid();
  }
  return sid;
}

async function fetchUnits() {
  const currentSid = await getSid();

  const res = await axios.get(BASE_URL, {
    params: {
      svc: "core/search_items",
      sid: currentSid,
      params: JSON.stringify({
        spec: {
          itemsType: "avl_unit",
          propName: "sys_name",
          propValueMask: "*",
          sortType: "sys_name",
        },
        force: 1,
        flags: 1,
        from: 0,
        to: 0,
      }),
    },
  });

  return res.data.items || [];
}

module.exports = {
  fetchUnits,
};
