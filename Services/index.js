const axios = require("axios");

const access_key = process.env.UNSPLASH_ACCESS_KEY;

function getUID() {
  let uid = "";
  for (let index = 0; index < 6; index++) {
    const rand = Math.floor(Math.random() * 10);
    uid += rand;
  }
  return uid;
}

async function getUnsplashPhoto(name) {
  const URL = `https://api.unsplash.com/search/photos?client_id=${access_key}&query=${name}`;
  const res = await axios.get(URL);

  const photo = res.data.results;
  const fallBackPhoto =
    "https://www.thetravelmagazine.net/wp-content/uploads/World-Wonders-Tour-Image.jpg";
  if (photo === 0) {
    return fallBackPhoto;
  }
  const photoLen = photo.length;
  const randIndex = Math.floor(Math.random() * photoLen);
  return res.data.results[randIndex].urls.thumb;
}
module.exports = {
  getUID,
  getUnsplashPhoto,
};
