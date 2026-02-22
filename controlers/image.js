const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

const buildClarifaiImageInput = (input) => {
  if (!input || typeof input !== "string") return null;
  

  const trimmedInput = input.trim();
  const dataUrlMatch = trimmedInput.match(/^data:image\/[a-zA-Z0-9.+-]+;base64,(.+)$/);

  if (dataUrlMatch) return { base64: dataUrlMatch[1],};
  
  return {
    url: trimmedInput,
    allow_duplicate_url: true,
  };
};

const handleAPICall = (req, res) => {
  const metadata = new grpc.Metadata();
  metadata.set("authorization", `Key ${process.env.CLARIFAI_PAT}`);

  const imageInput = buildClarifaiImageInput(req.body.input);

  if (!imageInput) {
    return res.status(400).json("Invalid image input");
  }

  const request = {
    user_app_id: {
      user_id: process.env.CLARIFAI_USER_ID || "clarifai",
      app_id: process.env.CLARIFAI_APP_ID || "main",
    },
    model_id: process.env.CLARIFAI_MODEL_ID || "face-detection",
    version_id: process.env.CLARIFAI_MODEL_VERSION_ID,
    inputs: [
      {
        data: {
          image: imageInput,
        },
      },
    ],
  };

  stub.PostModelOutputs(request, metadata, (err, response) => {
    if (err) {
      console.error("CLARIFAI gRPC ERROR:", err);
      return res.status(502).json("Clarifai error");
    }
    if (response.status.code !== 10000) {
      console.error("CLARIFAI STATUS:", response.status);
      return res.status(400).json("Clarifai error");
    }
    return res.json(response);
  });
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
  db("users").where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then(entries => {
      res.json(entries[0]);
    })
    .catch(err => res.status(400).json("Hmmm unable to get entries"));
};

module.exports = {
  handleImage,
  handleAPICall
};
