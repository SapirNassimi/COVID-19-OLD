console.log('Client side javascript is loaded');

const countryForm = document.querySelector('form');
const serach = document.querySelector('input');
const message = document.querySelector('#message');

const totalCases = document.querySelector('#total-cases');
const newCases = document.querySelector('#new-cases');
const critical = document.querySelector('#critical');
const recovered = document.querySelector('#recovered');
const activeCases = document.querySelector('#active-cases');
const totalDeaths = document.querySelector('#deaths');
const newDeaths = document.querySelector('#new-deaths');

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