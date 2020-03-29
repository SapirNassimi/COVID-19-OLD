console.log('Client side javascript is loaded');

const countryForm = document.querySelector('form');
const serach = document.querySelector('input');
const message = document.querySelector('#message');

const countryName = document.querySelector('#col-col-1');
const totalCases = document.querySelector('#col-col-1');
const newCases = document.querySelector('#col-col-2');
const critical = document.querySelector('#col-col-3');
const recovered = document.querySelector('#col-col-4');
const activeCases = document.querySelector('#col-col-1');
const totalDeaths = document.querySelector('#col-col-1');
const newDeaths = document.querySelector('#col-col-1');

countryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const country = serach.value;

    message.textContent = 'Loading';

    fetch(`/country?country=${country}`).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                console.log(data.error);
                message.textContent = data.error;
            } else {
                const details = data.details.response[0];
                const cases = details.cases;
                const deaths = details.deaths;

                console.log(data.details);
                message.textContent =  '';

                totalCases.textContent = cases.total;
                newCases.textContent = cases.new;
                critical.textContent = cases.critical;
                recovered.textContent = cases.recovered;
                activeCases.textContent = cases.active;
                totalDeaths.textContent = deaths.total;
                newDeaths.textContent = deaths.new;
            }
        });
    });
});



/*

                <li class="table-row">
                    <div class="col col-1" data-label="Country">Israel</div>
                    <div class="col col-2" data-label="Total Cases">3600</div>
                    <div class="col col-3" data-label="New Cases">+300</div>
                    <div class="col col-4" data-label="Total Deaths">12</div>
                    <div class="col col-5" data-label="New Deaths">1</div>
                    <div class="col col-6" data-label="Critical">50</div>
                    <div class="col col-7" data-label="recovered">80</div>
                    <div class="col col-8" data-label="Active Cases">3500</div>
                </li>
*/