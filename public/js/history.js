const inputForm = document.querySelector('#input-form');
const loader = document.querySelector('.loader');
const countryInput = document.querySelector('#country-selector');
const dateInput = document.querySelector('#date-input');
const submitInput = document.querySelector('#show-results');
const deathsPerDaySvg = document.querySelector('#deaths-per-day-graph');
const deathsPerDayGraphTitle = document.querySelector('#deaths-per-day-graph-title');

let numberOfActiveFetchrequests = 0;

window.onload = async () => {
    disableSubmitBotton(true);
    fillCountriesDropDownList();
    fillGlobalData();

    const data = await getDataFromServer(`/history/country?country=${localStorage.getItem('mostInfectedCountry')}&date=${getDefaultDateForGraphs()}`);

    fillDeathsPerDayGrapghLinear(data.data);
    deathsPerDayGraphTitle.textContent = `Deaths Per Day In ${localStorage.getItem('mostInfectedCountry')}`;
}

inputForm.addEventListener('submit', async event => {
    event.preventDefault();

    let route = '/history/country?country=';

    if (countryInput.selectedIndex !== 0) {
        route += countryInput.value;

        dateInput.value !== '' ? route += `&date=${dateInput.value}` : dateInput;

        const data = await getDataFromServer(route);

        fillDeathsPerDayGrapghLinear(data.data);

        deathsPerDayGraphTitle.textContent = `Deaths Per Day In ${countryInput.value}`;
    }
});

countryInput.addEventListener('click', () => {
    countryInput.selectedIndex !== 0 ? disableSubmitBotton(false) : disableSubmitBotton(true);
});

const getDataFromServer = async route => {
    loader.hidden = false;
    numberOfActiveFetchrequests++;

    const response = await (await fetch(route)).json();

    response.error ? console.log(response.error) : console.log(response.details);

    numberOfActiveFetchrequests--;
    numberOfActiveFetchrequests === 0 ? loader.hidden = true : false;
    
    return response.details;
}

const fillDeathsPerDayGrapghLinear = data => {
    clearSvg();
    
    const yAxisRange = getMinAndMaxValuesForYAxisByProperty(data, 'new_deaths');
    
    const margin = { top: 10, right: 30, bottom: 30, left: 60 };
    const width = 460 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select('#deaths-per-day-graph')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
        .domain(d3.extent(data, d => d3.timeParse("%Y-%m-%d")(d.date)))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([yAxisRange.minimum, yAxisRange.maximum])
        .range([height, 0]);

    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x));

    svg.append('g')
        .call(d3.axisLeft(y));

    const line = d3.line()
        .x(d => x(d3.timeParse("%Y-%m-%d")(d.date)))
        .y(d => y(d.new_deaths));

    svg.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#69b3a2')
        .attr('stroke-width', 1.5)
        .attr('d', line);

    svg.append('g')
        .selectAll('dot')
        .data(data)
        .enter()
        .append('circle')
        .attr('cx', d => x(d3.timeParse("%Y-%m-%d")(d.date)))
        .attr('cy', d => y(d.new_deaths))
        .attr('r', 3)
        .attr('fill', '#69b3a2');
}

const fillDeathsPerDayGrapghCircles = data => {
    let margin = { top: 10, right: 30, bottom: 30, left: 60 };
    let width = 460 - margin.left - margin.right;
    let height = 400 - margin.top - margin.bottom;

    let svg = d3.select('#deaths-per-day-graph')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom);

    let circles = svg.selectAll('circle')
        .data(data.data)
        .enter()
        .append('circle');

    circles.attr('cx', (d, i) => (i * 20))
        .attr('cy', height / 2)
        .attr('r', d => d.new_deaths)
        .attr('fill', 'yellow')
        .attr('stroke', 'orange')
        .attr('stroke-width', d => d.new_deaths / 2);
}

const clearSvg = () => {
    const numberOfChildren = deathsPerDaySvg.children.length;
    
    for (let i = 0; i < numberOfChildren; i++) {
        deathsPerDaySvg.removeChild(deathsPerDaySvg.children[0]);
    }
}

const getMinAndMaxValuesForYAxisByProperty = (data, property) => {    
    const output = {
        minimum: data[0][property],
        maximum: data[0][property]
    }

    for (let i = 0; i < data.length; i++) {
        data[i][property] < output.minimum ? output.minimum = data[i][property] : false;
        data[i][property] > output.maximum ? output.maximum = data[i][property] : false;
    }

    const axisPadding = Math.round((output.maximum - output.minimum) * 0.2);

    output.minimum -= axisPadding;
    output.maximum += axisPadding;

    output.minimum < 0 ? output.minimum = 0 : false;

    return output;
}

const fillCountriesDropDownList = async () => {
    let data = await getDataFromServer('/history/countries/names');
    let option;

    data.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
    
    for (let i = 0; i < data.length; i++) {
        option = document.createElement('option');
        option.setAttribute('value', data[i].name);
        option.appendChild(document.createTextNode(data[i].name));
        countryInput.appendChild(option);
    }
}

const disableSubmitBotton = (disable) => {
    disable ? submitInput.classList.add('disabled-button') : submitInput.classList.remove('disabled-button');
}

const fillGlobalData = () => {
    document.querySelector('#virus-cases-top').textContent = localStorage.getItem('casesTop');
    document.querySelector('#deaths-top').textContent = localStorage.getItem('deathsTop');
    document.querySelector('#recovered-top').textContent = localStorage.getItem('recoveredTop');
    document.querySelector('#update-time-top-value').textContent = localStorage.getItem('updateTimeTop');
}

const getDefaultDateForGraphs = () => {
    const returnDate = new Date((new Date).getTime() - (86400000 * 10));

    return `${returnDate.getFullYear()}-${returnDate.getMonth() + 1}-${returnDate.getDate()}`
}