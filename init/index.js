require("dotenv").config();
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const getCoords = require("../utils/geocode");

const mongoURL = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoURL);
}

const initDB = async () => {
  await Listing.deleteMany({});

  const updatedData = [];

  for (let obj of initData.data) {
    try {
      await new Promise((res) => setTimeout(res, 1000));

      const coords = await getCoords(obj.location);

      updatedData.push({
        ...obj,
        owner: "69dbe8f97152aa1d73b6b9e4",
        latitude: coords.lat,
        longitude: coords.lng,
      });

      console.log(`✔ Updated: ${obj.title}`);
    } catch (err) {
      console.log(`❌ Error for ${obj.title}`);
      updatedData.push({
        ...obj,
        owner: "69dbe8f97152aa1d73b6b9e4",
        latitude: 28.6139,
        longitude: 77.2090,
      });
    }
  }

  await Listing.insertMany(updatedData);

  console.log("✅ Data initialized with coordinates");
};
initDB();