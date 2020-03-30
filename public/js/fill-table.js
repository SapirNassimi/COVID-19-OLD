console.log('Client side javascript is loaded');

const statisticsForm = document.querySelector('form');
const countryInput = document.querySelector('#country-input');
const limitInput = document.querySelector('#limit-input');
const message = document.querySelector('#message');
const table = document.querySelector('ul');

let totalsRecord;

window.onload = () => {
    loadData();
}

statisticsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    loadData();
});

limitInput.addEventListener('input', (event) => {
    limitInput.value ? countryInput.disabled = true : countryInput.disabled = false;
});

countryInput.addEventListener('input', (event) => {
    countryInput.value ? limitInput.disabled = true : limitInput.disabled = false;
});

const loadData = () => {
    message.textContent = 'Loading';
    let route = '/country';

    countryInput.value.trim() ? route += `?country=${countryInput.value}` : route;

    if (limitInput.value != 0) {
        route.includes('?') ? route += '&' : route += '?';
        route += `limit=${+limitInput.value + 1}`;
    }

    getDataFromServer(route, data => {
        const numberOfChildren = table.children.length;
        totalsRecord = undefined;

        for (let i = 1; i < numberOfChildren; i++) {
            table.removeChild(table.children[1]);
        }

        if (data.response[0].country === "All") {
            data.totals = data.response[0];
            data.results -= 1;
            delete data.response[0];

            fillGlobalData(data.totals);
            updateTotalsRecord(data.totals);
        }

        fillTable(data);

        totalsRecord ? table.appendChild(totalsRecord) : false;
    });
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

const fillTable = tableData => {
    tableData.response.forEach(countryData => {
        table.appendChild(createListItem(countryData));
    });
}

const fillGlobalData = globalData => {

}

const updateTotalsRecord = (data) => {
    totalsRecord = createListItem(data);

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
        divTotalCases.textContent = countryData.cases.total;
        li.appendChild(divTotalCases);

        let divNewCases = document.createElement('div');
        divNewCases.classList.add('col', 'col-3', 'red');
        divNewCases.textContent = countryData.cases.new;
        li.appendChild(divNewCases);

        let divtotalDeaths = document.createElement('div');
        divtotalDeaths.classList.add('col', 'col-4');
        divtotalDeaths.textContent = countryData.deaths.total;
        li.appendChild(divtotalDeaths);

        let divNewDeaths = document.createElement('div');
        divNewDeaths.classList.add('col', 'col-5', 'red');
        divNewDeaths.textContent = countryData.deaths.new;
        li.appendChild(divNewDeaths);

        let divCritical = document.createElement('div');
        divCritical.classList.add('col', 'col-6');
        divCritical.textContent = countryData.cases.critical;
        li.appendChild(divCritical);

        let divRecovered = document.createElement('div');
        divRecovered.classList.add('col', 'col-7', 'green');
        divRecovered.textContent = countryData.cases.recovered;
        li.appendChild(divRecovered);

        let divActiveCases = document.createElement('div');
        divActiveCases.classList.add('col', 'col-8');
        divActiveCases.textContent = countryData.cases.active;
        li.appendChild(divActiveCases);

    return li;
}