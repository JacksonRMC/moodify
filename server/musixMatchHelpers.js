const qp = require('query-parse');
const request = require('request');
const config = require('../config/index.js');

const MM_API_KEY = config.MM_API_KEY;
const rootUrl = 'https://api.musixmatch.com/ws/1.1/';

const finalQueryString = (method, params) => rootUrl + method + qp.toString(params);

const promiseHelper = (method, params) =>
  new Promise((resolve, reject) => {
    request(finalQueryString(method, params), (error, response, body) => {
      if (error) { reject(error); }
      const parsedBody = JSON.parse(body);
      if (parsedBody.message.header.status_code === 404) {
        reject({ errorMessage: 'not found' });
      } else {
        const result = parsedBody.message.body;
        resolve(result);
      }
    });
  });

// not used at all, commented out for now...
// const getTrackInfo = (trackId) => {
//   const method = 'track.get?';
//   let params = {
//     apikey: MM_API_KEY,
//     format: 'json',
//     callback: 'callback',
//     track_id: trackId
//   };
//   return promiseHelper(method, params);
// };

const getLyricsByTrackId = (trackId) => {
  const method = 'track.lyrics.get?';
  const params = {
    apikey: MM_API_KEY,
    format: 'json',
    callback: 'callback',
    track_id: trackId,
  };
  return promiseHelper(method, params);
};

const getLyricsByTitleAndArtist = (title, artist) => {
  const method = 'matcher.lyrics.get?';
  const params = {
    apikey: MM_API_KEY,
    format: 'json',
    callback: 'callback',
    q_track: title,
    q_artist: artist,
  };
  return promiseHelper(method, params);
};

const searchByTitleAndArtist = (title, artist) => {
  const method = 'track.search?';
  const params = {
    apikey: MM_API_KEY,
    format: 'json',
    callback: 'callback',
    q_track: title,
    q_artist: artist,
    page_size: 10,
    page: 1,
    s_track_rating: 'desc',
  };
  return promiseHelper(method, params);
};

// Also not used, comment out for now.
// const filterSong = (str) => {
//   let filteredStr = '';
//   for (let i = 0; i < str.length; i += 1) {
//     if (str[i] === '*') {
//       break;
//     } else { filteredStr += str[i]; }
//   }
//   return filteredStr;
// };

module.exports.getLyricsByTrackId = getLyricsByTrackId;
module.exports.getLyricsByTitleAndArtist = getLyricsByTitleAndArtist;
module.exports.searchByTitleAndArtist = searchByTitleAndArtist;
