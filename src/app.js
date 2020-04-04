const path = require('path');
const express = require('express');
const hbs = require('hbs');
const moment = require('moment');

const { getStatistics } = require('./utils/statistics');
const { getHistoryForCountryOnDate, getSupportedCountryNames } = require('./utils/history');
const { sortByMostInfected } = require('./utils/sortRecords');

const app = express();

const port = process.env.PORT || 3000;
const OLDEST_DATA_FROM_API_DATE = '2020-01-22'

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

app.get('/history', (req, res) => {
    res.render('history');
});

app.get('/country', async (req, res) => {
    const country = req.query.country;

    try {
        const data = await getStatistics(country);
        
        console.log(data.response.length);

        sortByMostInfected(data.response);
        data.response.shift();

        res.send({
            details: data
        });
    } catch (error) {
        res.render('index', {
            error: 'An error occured. Try again later',
            additionalErrorData: error
        });
    }
});

app.get('/history/country/date', async (req, res) => {
    const country = req.query.country;
    const date = req.query.date;

    try {
        const data = await getHistoryForCountryOnDate(country, date);

        res.send({
            details: data
        });
    } catch (error) {
        res.render('index', {
            error: 'An error occured. Try again later',
            additionalErrorData: error
        });
    }
});

app.get('/history/country', async (req, res) => {
    const country = req.query.country;
    const output = { country: country, data: [] };
    let date;
    let rawData;
    let dataPerDay;

    req.query.date ? date = req.query.date : date = OLDEST_DATA_FROM_API_DATE;

    try {
        while (date < moment(new Date()).format('YYYY-MM-DD')) {
            rawData = await getHistoryForCountryOnDate(country, date);
            rawData = rawData.data;

            dataPerDay = {
                date: date,
                cases: 0,
                deaths: 0,
                recovered: 0,
                active: 0,
                fatality_rate: 0,
                new_cases: 0,
                new_deaths: 0,
                new_recovered: 0
            }

            for (let i = 0; i < rawData.length; i++) {
                dataPerDay.cases += rawData[i].confirmed;
                dataPerDay.deaths += rawData[i].deaths;
                dataPerDay.recovered += rawData[i].recovered;
                dataPerDay.active += rawData[i].active;
                dataPerDay.fatality_rate = dataPerDay.deaths / dataPerDay.cases;
                dataPerDay.new_cases += rawData[i].confirmed_diff;
                dataPerDay.new_deaths += rawData[i].deaths_diff;
                dataPerDay.new_recovered += rawData[i].recovered_diff;
            }

            output.data.push(dataPerDay);

            date = moment(date, 'YYYY-MM-DD').add(1, 'day').format('YYYY-MM-DD');
        }

        res.send({
            details: output
        });
    } catch (error) {
        res.render('index', {
            error: 'An error occured. Try again later',
            additionalErrorData: error
        });
    }
});

app.get('/history/countries/names', async (req, res) => {
    try {    
        const data = await getSupportedCountryNames();

        res.send({
            details: data.data
        });
    } catch (error) {
        res.render('index', {
            error: 'An error occured. Try again later',
            additionalErrorData: error
        });
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