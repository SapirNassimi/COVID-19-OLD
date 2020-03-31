console.log('Client side javascript is loaded');

const statisticsForm = document.querySelector('form');
const countryInput = document.querySelector('#country-input');
const message = document.querySelector('#message');
const table = document.querySelector('ul');

let allData;
let totalsRecord;

window.onload = () => {
    message.textContent = 'Loading';

    getDataFromServer('/country', data => {
        data.totals = data.response[0];
        data.results -= 1;
        delete data.response[0];

        allData = data;

        updateTotalsRecord();
        fillGlobalData();

        fillTable(allData);
    });
}

countryInput.addEventListener('input', () => {
    countryInput.value === '' ? countryInput.value === undefined : countryInput;

    refreshData({ country: countryInput.value });
});

const refreshData = ({ country, limit }) => {
    const filteredData = JSON.parse(JSON.stringify(allData));
    
    message.textContent = 'Loading';

    if (country) {
        const filteringText = country.toUpperCase();

        filteredData.response = [undefined];
        filteredData.results = 0;

        for (let i = 1; i < allData.response.length; i++) {
            if (allData.response[i].country.toUpperCase().includes(filteringText)) {
                filteredData.response.push(allData.response[i]);
                filteredData.results++;
            }
        }
    } else if (limit) {
        filteredData.response = [undefined];
        filteredData.results = 0;
    }

    message.textContent = '';
    fillTable(filteredData);
}

const getDataFromServer = (route, callback) => {
    fetch(route).then(response => {
        console.log(response);
        response.json().then(data => {
            if (data.error) {
                console.log(data.error);
                message.textContent = data.error;
            } else {
                console.log(data.details);
                message.textContent = '';
                callback(data.details);
            }
        });
    });
}

const fillTable = data => {
    const numberOfChildren = table.children.length;

    for (let i = 1; i < numberOfChildren; i++) {
        table.removeChild(table.children[1]);
    }

    for (let i = 1; i < data.response.length; i++) {
        table.appendChild(createListItem(data.response[i]));
    }

    totalsRecord ? table.appendChild(totalsRecord) : false;
}

const fillGlobalData = () => {
    const casesTop = document.querySelector('#virus-cases-top');
    const deathsTop = document.querySelector('#deaths-top');
    const recoveredTop = document.querySelector('#recovered-top');

    const totalsFromAllData = allData.totals;

    casesTop.textContent = totalsFromAllData.cases.total;
    deathsTop.textContent = totalsFromAllData.deaths.total;
    recoveredTop.textContent = totalsFromAllData.cases.recovered;
}

const updateTotalsRecord = () => {
    const totalsFromAllData = allData.totals;
    totalsRecord = createListItem(totalsFromAllData);

    totalsRecord.classList.add('totals-row');
    totalsRecord.children[0].textContent = 'Totals Worldwide';
    totalsRecord.children[0].classList.add('totals-header-div');

    totalsRecord.childNodes.forEach(child => {
        child.classList.add('totals-data');
    });
}

const createListItem = countryData => {
    let li = document.createElement('li');
        li.classList.add('table-row');
        
        let divCountry = document.createElement('div');
        divCountry.classList.add('col', 'col-1');
        divCountry.textContent = countryData.country;
        li.appendChild(divCountry);

        let divTotalCases = document.createElement('div');
        divTotalCases.classList.add('col', 'col-2');
        divTotalCases.textContent = countryData.cases.total.toLocaleString();
        li.appendChild(divTotalCases);

        let divNewCases = document.createElement('div');
        divNewCases.classList.add('col', 'col-3', 'red');
        divNewCases.textContent = countryData.cases.new;
        li.appendChild(divNewCases);

        let divtotalDeaths = document.createElement('div');
        divtotalDeaths.classList.add('col', 'col-4');
        divtotalDeaths.textContent = countryData.deaths.total.toLocaleString();
        li.appendChild(divtotalDeaths);

        let divNewDeaths = document.createElement('div');
        divNewDeaths.classList.add('col', 'col-5', 'red');
        divNewDeaths.textContent = countryData.deaths.new;
        li.appendChild(divNewDeaths);

        let divCritical = document.createElement('div');
        divCritical.classList.add('col', 'col-6');
        divCritical.textContent = countryData.cases.critical.toLocaleString();
        li.appendChild(divCritical);

        let divRecovered = document.createElement('div');
        divRecovered.classList.add('col', 'col-7', 'green');
        divRecovered.textContent = countryData.cases.recovered.toLocaleString();
        li.appendChild(divRecovered);

        let divActiveCases = document.createElement('div');
        divActiveCases.classList.add('col', 'col-8');
        divActiveCases.textContent = countryData.cases.active.toLocaleString();
        li.appendChild(divActiveCases);

    return li;
}