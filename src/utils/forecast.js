const request = require('request');


const forecast = function (latitude, longitude, callback) {
    const url = `https://api.darksky.net/forecast/c3122762cf40fe03993fdf1f5069337e/${latitude},${longitude}`;

    request({ url, json: true }, (error, { body }) => {
        if (error) {
            callback('Unable to connect to weather service.', undefined)
        } else if (body.error) {
            callback('Unable to find location.', undefined)
        } else {
            callback(undefined, `${body.daily.data[0].summary} It is currently ${body.currently.temperature} degrees out. There is a ${body.currently.precipProbability}% chance of rain.`
            );
        }
    });
};


module.exports = forecast;