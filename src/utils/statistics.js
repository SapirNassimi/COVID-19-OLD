const unirest = require('unirest');

const getAllCountriesData = () => {
    const request = unirest('GET', 'https://covid-193.p.rapidapi.com/statistics');

    request.headers({
        'x-rapidapi-host': 'covid-193.p.rapidapi.com',
        'x-rapidapi-key': 'd7382f77damsh1447cc50e9c4f49p1b3e7cjsn48d3d0e9d300'
    });
    
    request.end(res => {
        if (res.error) {
            throw new Error(res.error);
        }
    
        console.log(res.body);
    });
}

const getCountryData = (countryName, callback) => {
    const request = unirest('GET', 'https://covid-193.p.rapidapi.com/statistics');

    request.query({
        country: countryName
    });

    request.headers({
        'x-rapidapi-host': 'covid-193.p.rapidapi.com',
        'x-rapidapi-key': 'd7382f77damsh1447cc50e9c4f49p1b3e7cjsn48d3d0e9d300'
    });

    request.end(res => {
        if (res.error) {
            callback(res.error);
        }
    
        callback(undefined, res.body);
    });
}

module.exports = {
    getAllCountriesData,
    getCountryData
}