const path = require('path');
const express = require('express');
const hbs = require('hbs');

const { getStatistics } = require('./utils/statistics');
const { sortByMostInfected } = require('./utils/sortRecords');

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
    res.render('index');
});

app.get('/country', (req, res) => {
    const country = req.query.country;

    getStatistics(country, (error, data) => {
        if (error) {
            return res.render('index', {
                error: 'An error occured. Try again later',
                additionalErrorData: error
            }); 
        }

        sortByMostInfected(data.response);
        
        res.send({
            details: data
        });
    });
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