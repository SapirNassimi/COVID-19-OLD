console.log('Client side javascript is loaded');

const statisticsForm = document.querySelector('form');
const serach = document.querySelector('input');
const message = document.querySelector('#message');

statisticsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    message.textContent = 'Loading';
    let route;
    let tableData;

    if (serach.value.trim()) {
        const country = serach.value;
        route = `/country?country=${country}`;
    } else {
        route = '/worldwide';
    }

    fetch(route).then(response => {
        response.json().then(data => {
            if (data.error) {
                console.log(data.error);
                message.textContent = data.error;
            } else {
                console.log(data.details);
                message.textContent =  '';
                tableData = data.details;
                fillTable(tableData);
            }
        });
    });
});

const fillTable = tableData => {
    const table = document.querySelector('ul');

    tableData.response.forEach(countryData => {
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

        table.appendChild(li);
    });
}