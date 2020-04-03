const unirest = require('unirest');

const getStatistics = async countryName => {
    const request = unirest.get('https://covid-193.p.rapidapi.com/statistics')
        .headers({
            'x-rapidapi-host': 'covid-193.p.rapidapi.com',
            'x-rapidapi-key': 'd7382f77damsh1447cc50e9c4f49p1b3e7cjsn48d3d0e9d300'
        });

    let response;

    countryName ? response = await request.query({ country: countryName }).send() : response = await request.send();

    if (response.error) {
        return new Error(response.error);
    } else {
        console.log('Done fetching data');

        return response.body;
    }
}

module.exports = {
    getStatistics
}