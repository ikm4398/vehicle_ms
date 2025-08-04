// modules/units.js
const axios = require("axios");
const getSid = require("./sidManager");

const BASE_URL = "http://pro.telemko.com/wialon/ajax.html";

async function fetchUnits() {
  try {
    const sid = await getSid();

    const response = await axios.get(BASE_URL, {
      params: {
        svc: "core/search_items",
        sid: sid,
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

    const items = response.data.items || [];

    const formattedUnits = items.map((item) => ({
      vehicle_registration_number: item.nm,
      unit_id: item.id,
    }));

    return {
      success: true,
      message: "Units fetched successfully",
      data: formattedUnits,
    };
  } catch (error) {
    console.error("Error fetching units:", error.message);
    return {
      success: false,
      message: "Failed to fetch units",
      error: error.message,
    };
  }
}

module.exports = fetchUnits;
