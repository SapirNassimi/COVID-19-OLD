const sortByMostInfected = countriesArray => {
    countriesArray.sort((a, b) => parseInt(b.cases.total) - parseInt(a.cases.total));
}

module.exports = {
    sortByMostInfected
}