const axios = require("axios");

const handleAPICall = async (req, res) => {
  const imageUrl = req.body.input;

  // Use the public Clarifai face detection model
  const USER_ID = "clarifai";
  const APP_ID = "main";
  const MODEL_ID = "face-detection"; // not the old hash id

  const url = `https://api.clarifai.com/v2/users/${USER_ID}/apps/${APP_ID}/models/${MODEL_ID}/outputs`;

  try {
    const r = await axios.post(
      url,
      {
        inputs: [{ data: { image: { url: imageUrl } } }],
      },
      {
        headers: {
          Authorization: `Key ${process.env.CLARIFAI_PAT}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        timeout: 15000,
      }
    );

    // Clarifai success is usually status.code = 10000
    if (r.data?.status?.code !== 10000) {
      console.error("CLARIFAI REST ERROR:", r.data);
      return res.status(400).json("Something went wrong with the api");
    }

    return res.json(r.data);
  } catch (err) {
    console.error("CLARIFAI AXIOS ERROR:", err.response?.data || err.message);
    return res.status(400).json("Something went wrong with the api");
  }
};
/*
Depricated code (5 years old as of now holy shit)
const Clarifai = require("clarifai");
const app = new Clarifai.App({
    apiKey: process.env.CLARIFAI_API_KEY
});

const handleAPICall = (req,res) => {
    app.models.predict(
        Clarifai.FACE_DETECT_MODEL,
        req.body.input)
         .then(data => {
             res.json(data);
         })
         .catch(err => res.status(400).json("Something went wrong with the api"))
}

*/       

const handleImage = (req, res, db) => {
    const { id } = req.body;
    db("users").where('id', '=', id)
     .increment("entries", 1)
     .returning("entries")
     .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json("Hmmm unable to get entries"))
}

module.exports = {
    handleImage,
    handleAPICall
}
