console.log('Client side javascript is loaded');

const countryInput = document.querySelector('#country-input');
const message = document.querySelector('#message');
const table = document.querySelector('ul');

const col2header = document.querySelector('#col-2-header');
const col3header = document.querySelector('#col-3-header');
const col4header = document.querySelector('#col-4-header');
const col5header = document.querySelector('#col-5-header');
const col6header = document.querySelector('#col-6-header');
const col7header = document.querySelector('#col-7-header');
const col8header = document.querySelector('#col-8-header');

let allData;
let totalsRecord;
let lastOrderdColumn = { name: col2header.textContent, isAscending: false };

window.onload = async () => {
    message.textContent = 'Loading';

    const data = await getDataFromServer('/country');

    data.totals = data.response[0];
    data.results -= 1;
    data.response.shift();
    
    allData = data;
    
    updateTotalsRecord();
    fillGlobalData();
    fillTable(allData);
}

countryInput.addEventListener('input', () => {
    filterTable();
});

col2header.addEventListener('click', () => {
    lastOrderdColumn.name === col2header.textContent ? 
        lastOrderdColumn.isAscending = !lastOrderdColumn.isAscending : 
        lastOrderdColumn = { name: col2header.textContent, isAscending: false};

    sortByProperty('cases', 'total', lastOrderdColumn.isAscending);
});

col3header.addEventListener('click', () => {
    lastOrderdColumn.name === col3header.textContent ? 
        lastOrderdColumn.isAscending = !lastOrderdColumn.isAscending : 
        lastOrderdColumn = { name: col3header.textContent, isAscending: false};
    
    sortByProperty('cases', 'new', lastOrderdColumn.isAscending);
});

col4header.addEventListener('click', () => {
    lastOrderdColumn.name === col4header.textContent ? 
        lastOrderdColumn.isAscending = !lastOrderdColumn.isAscending : 
        lastOrderdColumn = { name: col4header.textContent, isAscending: false};

    sortByProperty('deaths', 'total', lastOrderdColumn.isAscending);
});

col5header.addEventListener('click', () => {
    lastOrderdColumn.name === col5header.textContent ? 
        lastOrderdColumn.isAscending = !lastOrderdColumn.isAscending : 
        lastOrderdColumn = { name: col5header.textContent, isAscending: false};

    sortByProperty('deaths', 'new', lastOrderdColumn.isAscending);
});

col6header.addEventListener('click', () => {
    lastOrderdColumn.name === col6header.textContent ? 
        lastOrderdColumn.isAscending = !lastOrderdColumn.isAscending : 
        lastOrderdColumn = { name: col6header.textContent, isAscending: false};

    sortByProperty('cases', 'critical', lastOrderdColumn.isAscending);
});

col7header.addEventListener('click', () => {
    lastOrderdColumn.name === col7header.textContent ? 
        lastOrderdColumn.isAscending = !lastOrderdColumn.isAscending : 
        lastOrderdColumn = { name: col7header.textContent, isAscending: false};

    sortByProperty('cases', 'recovered', lastOrderdColumn.isAscending);
});

col8header.addEventListener('click', () => {
    lastOrderdColumn.name === col8header.textContent ? 
        lastOrderdColumn.isAscending = !lastOrderdColumn.isAscending : 
        lastOrderdColumn = { name: col8header.textContent, isAscending: false};
    
    sortByProperty('cases', 'active', lastOrderdColumn.isAscending);
});

const refreshData = ({ country }) => {
    const filteredData = JSON.parse(JSON.stringify(allData));
    
    message.textContent = 'Loading';

    if (country) {
        const filteringText = country.toUpperCase();

        filteredData.results = 0;
        filteredData.response = [];

        for (let i = 1; i < allData.response.length; i++) {
            if (allData.response[i].country.toUpperCase().includes(filteringText)) {
                filteredData.response.push(allData.response[i]);
                filteredData.results++;
            }
        }
    }

    message.textContent = '';
    fillTable(filteredData);
}

const getDataFromServer = async route => {
    const response = await (await fetch(route)).json();

    if (response.error) {
        console.log(response.error);
        message.textContent = data.error;
    } else {
        console.log(response.details);
        message.textContent = '';

        return response.details;
    }
}

const fillTable = data => {
    const numberOfChildren = table.children.length;

    for (let i = 1; i < numberOfChildren; i++) {
        table.removeChild(table.children[1]);
    }

    for (let i = 0; i < data.response.length; i++) {
        table.appendChild(createListItem(data.response[i]));
    }

    totalsRecord ? table.appendChild(totalsRecord) : false;
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

const fillGlobalData = () => {
    const casesTop = document.querySelector('#virus-cases-top');
    const deathsTop = document.querySelector('#deaths-top');
    const recoveredTop = document.querySelector('#recovered-top');
    const updateTimeTop = document.querySelector('#update-time-top-value');

    const totalsFromAllData = allData.totals;

    casesTop.textContent = totalsFromAllData.cases.total.toLocaleString();
    deathsTop.textContent = totalsFromAllData.deaths.total.toLocaleString();
    recoveredTop.textContent = totalsFromAllData.cases.recovered.toLocaleString();
    updateTimeTop.textContent = new Date(totalsFromAllData.time).toLocaleString();
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
        divNewCases.textContent = toLocaleStringPlusSign(countryData.cases.new);
        li.appendChild(divNewCases);

        let divtotalDeaths = document.createElement('div');
        divtotalDeaths.classList.add('col', 'col-4');
        divtotalDeaths.textContent = countryData.deaths.total.toLocaleString();
        li.appendChild(divtotalDeaths);

        let divNewDeaths = document.createElement('div');
        divNewDeaths.classList.add('col', 'col-5', 'red');
        divNewDeaths.textContent = toLocaleStringPlusSign(countryData.deaths.new);
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

const sortByProperty = (firstProperty, secondProperty, isAscending) => {
    
    secondProperty ? 
        allData.response.sort((a, b) => b[firstProperty][secondProperty] - a[firstProperty][secondProperty]) :
        allData.response.sort((a, b) => b[firstProperty] - a[firstProperty]);

    isAscending ? allData.response.reverse() : false;

    fillTable(allData);
    filterTable();
}

const toLocaleStringPlusSign = string => {
    if (string && !isNaN(string) && isNaN(string.charAt(0))) {
        let stringWithCommas = string.substr(1);
        stringWithCommas = Number(stringWithCommas).toLocaleString();
        stringWithCommas = '+' + stringWithCommas;

        return stringWithCommas;
    }

    return null;
}

const filterTable = () => {
    countryInput.value === '' ? countryInput.value === undefined : countryInput;

    refreshData({ country: countryInput.value });
}