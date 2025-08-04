// modules/sidManager.js
const loginWithToken = require("./login");

let sid = null;
let sidExpiresAt = 0;

async function getSid() {
  const now = Date.now();
  if (!sid || now >= sidExpiresAt) {
    sid = await loginWithToken();
    sidExpiresAt = now + 4.5 * 60 * 1000; // valid ~5 minutes
    console.log("SID refreshed:", sid);
  }
  return sid;
}

module.exports = getSid;
