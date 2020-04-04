const message = document.querySelector('#message');

window.onload = async () => {
    const data = await getDataFromServer('/history/country?country=israel&date=2020-03-15');

    fillDeathsPerDayGrapghLinear(data.data);
}

const fillDeathsPerDayGrapghLinear = (data) => {
    let margin = { top: 10, right: 30, bottom: 30, left: 60 };
    let width = 460 - margin.left - margin.right;
    let height = 400 - margin.top - margin.bottom;

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
        .domain([0, 20])
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
        .attr('r', 5)
        .attr('fill', '#69b3a2');
}


const fillDeathsPerDayGrapghCircles = (data) => {
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

const getDataFromServer = async route => {
    message.textContent = 'Loading';
    
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