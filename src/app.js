const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000



// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to server
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Thomas Stricker'
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Thomas Stricker'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Thomas Stricker',
        helpText: 'This is some helpful text.'
    });
});

app.get('/weather', (req, res) => {
    const adress = req.query.adress;

    if (!adress) return res.send({ error: 'You must provide an adress!' });

    geocode(adress, (error, { latitude, longitude, location } = {}) => {
        if (error) return res.send({ error });

        forecast(latitude, longitude, (error, forecastData) => {
            if (error) return res.send({ error });

            res.send({
                forecast: forecastData,
                location: location,
                adress: req.query.adress
            });
        });
    });
});

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Error 404',
        name: 'Thomas Stricker',
        errorMessage: 'Help article not found!'
    });
});

app.get('*', (req, res) => {
    res.status(404).render('404', {
        title: 'Error 404',
        name: 'Thomas Stricker',
        errorMessage: 'Page not found!'
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}!`);
});