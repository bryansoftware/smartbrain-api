const Clarifai = require('clarifai');

const PAT = '9887763b45584ba8a8bd63080d35e33c';
const USER_ID = 'clarifai';
const APP_ID = 'main';
// const MODEL_ID = 'color-recognition';
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';

const handleApiCall = (req, res) => {
  console.log('IMAGE_URL: ', req.body.imageUrl)

  const raw = JSON.stringify({
    "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
    },
    "inputs": [
      {
        "data": {
          "image": {
            "url": req.body.imageUrl
          }
        }
      }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT
    },
    body: raw
  };

  fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions)
  .then(response => response.json())
  .then(data => {
    console.log('API data: ', data);
    res.json(data)
  })
	.catch(err => res.status(400).json('unable to work with API'))
}

const handleImage = (req, res, db) => {
	const { id, entries } = req.body;

	db.select('*').from('users')
	.where({
		id: id
	})
	.increment('entries', 1)
	.returning('entries')
	.then(entries => {
		res.json(entries[0].entries);
	})
	.catch(err => res.status(400).json('unable to get entries'));
}

module.exports = {
	handleImage: handleImage,
	handleApiCall: handleApiCall
}