const Clarifai = require('clarifai');

// Your PAT (Personal Access Token) can be found in the Account's Security section
const PAT = '';
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = 'clarifai';
const APP_ID = 'main';
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
// const MODEL_ID = 'color-recognition';
// const IMAGE_URL = 'https://samples.clarifai.com/metro-north.jpg';
let IMAGE_URL = '';

const handleApiCall = (req, res) => {
	IMAGE_URL = req.body.imageUrl;

  const raw = JSON.stringify({
    "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
    },
    "inputs": [
      {
        "data": {
          "image": {
            "url": IMAGE_URL
          }
        }
      }
    ]
  });

  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT,
      // 'Access-Control-Allow-Origin': '*',
      // 'Access-Control-Allow-Methods': 'POST,PUT'
    },
    body: raw
  };

  fetch("https://api.clarifai.com/v2/models/"
  // fetch("http://cors-anywhere.herokuapp.com/https://api.clarifai.com/v2/models/"
    + MODEL_ID 
    + "/versions/"
    + MODEL_VERSION_ID
    + "/outputs", requestOptions)
  	.then(data => {
  		res.json(data);
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