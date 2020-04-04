const unirest = require('unirest');

const getHistoryForCountryOnDate = async (countryName, date) => {
    const request = unirest.get('https://covid-19-statistics.p.rapidapi.com/reports')
        .headers({
            "x-rapidapi-host": "covid-19-statistics.p.rapidapi.com",
            "x-rapidapi-key": "d7382f77damsh1447cc50e9c4f49p1b3e7cjsn48d3d0e9d300"
        });

    if (countryName && date) {
        let response = await request.query({
            region_name: countryName,
            date: date
        }).send();

        if (response.error) {
            return new Error(response.error);
        } else {
            console.log(`Done fetching history data for ${countryName} on ${date}`);

            return response.body;
        }
    }
}

const getSupportedCountryNames = async () => {
    const request = unirest.get('https://covid-19-statistics.p.rapidapi.com/regions')
        .headers({
            "x-rapidapi-host": "covid-19-statistics.p.rapidapi.com",
	        "x-rapidapi-key": "d7382f77damsh1447cc50e9c4f49p1b3e7cjsn48d3d0e9d300"
        });

    let response = await request.send();

    if (response.error) {
        return new Error(response.error);
    } else {
        console.log('Done fetching all history country names');

        return response.body;
    }
}

module.exports = {
    getHistoryForCountryOnDate,
    getSupportedCountryNames
}