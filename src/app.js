const path = require('path');
const express = require('express');
const hbs = require('hbs');

const { getCountryData } = require('./utils/statistics');

const app = express();

const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        date: new Date().toDateString()
    });
});

app.get('/worldwide', (req, res) => {
    res.render('worldwide', {
        date: new Date().toDateString()
    });
});

app.get('/country', (req, res) => {
    const country = req.query.country;

    if (!country) {
        return res.render('country', {
            error: 'No country provided'
        });
    }

    console.log(country);

    try {
        getCountryData(country, (error, data) => {
            if (error) {
                return res.render('country', {
                    error: 'An error occured. Try again later',
                    additionalErrorData: error
                }); 
            }

            res.send({
                details: data
            });
        });
    } catch (error) {
        console.log(error);
    }
});

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Sapir Nassimi',
        errorMessage: 'Page not found'
    });
});

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});