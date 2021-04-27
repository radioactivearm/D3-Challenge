console.log('loaded bonus.js');

// started with a copy of app.js

// initializing size of circles
var radius = 9;

// This is to find the width of the container so I can set
// the width of the scatter plot to be the same
var scatter = d3.select('#scatter');
// console.log(head.text());
var scatterWidth = scatter.property('offsetWidth');
console.log(scatterWidth);


// I am going to make a graph

// ==========================================================
// Starting with the svg and chart group
// This beginning part is a Chocolate cake recipe I am pulling from
// class examples

// I may need to tweak these later to make it look good
var svgWidth = scatterWidth;
var svgHeight = 3 * svgWidth / 5;

var margin = {
    top: 50,
    right: 50,
    bottom: 120,
    left: 120
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

var svg = d3.select('#scatter')
    .append('svg')
    .attr('height', svgHeight)
    .attr('width', svgWidth);

var chartGroup = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);


// ===================================================================
// setting up functions for scales, axes, and circles
selectedX = 'poverty';
selectedY = 'healthcare';

// how long i want the transition to take
var clock = 1000;

// started with stubs to layout my plan

// scaler for x axis
function xScaler(statesData, selectedX) {
    console.log(`Scaling ${selectedX}`);

    var xScale = d3.scaleLinear()
        .domain(d3.extent(statesData, s => s[selectedX]))
        .range([0, width]);

    return xScale;
}

// scaler for y axis
function yScaler(statesData, selectedY) {
    console.log(`Scaling ${selectedY}`);

    var yScale = d3.scaleLinear()
        .domain(d3.extent(statesData, s => s[selectedY]))
        .range([height, 0]);

    return yScale;
}

// rendering new x Axis
function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(clock)
        .call(bottomAxis);

    return xAxis;
}

// rendering new y Axis
function renderYAxis(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(clock)
        .call(leftAxis);

    return yAxis;
}

// rendering new points for x circles
function renderXCircle(circleGroup, newXScale, selectedX) {

    circleGroup.transition()
        .duration(clock)
        .attr('cx', s => newXScale(s[selectedX]));

    return circleGroup;
}

// rendering new points for y circles
function renderYCircle(circleGroup, newYScale, selectedY) {

    circleGroup.transition()
        .duration(clock)
        .attr('cy', s => newYScale(s[selectedY]));

    return circleGroup;
}


// rendering new points for x abbr
function renderXAbbr(abbrGroup, newXScale, selectedX) {

    abbrGroup.transition()
        .duration(clock)
        .attr('x', s => newXScale(s[selectedX]));

    return abbrGroup;
}

// rendering new points for y abbr
function renderYAbbr(abbrGroup, newYScale, selectedY) {

    abbrGroup.transition()
        .duration(clock)
        .attr('y', s => newYScale(s[selectedY]) + radius / 2);

    return abbrGroup;
}


// ==================================================================

// time to call csv
d3.csv('assets/data/data.csv').then(function (statesData, err) {
    if (err) throw err;
    console.log(statesData);


    // ==========================================
    // i need to parse data into useable format
    statesData.forEach(state => {
        // console.log(typeof state.income);

        state.age = +state.age;
        state.ageMoe = +state.ageMoe;
        state.healthcare = +state.healthcare;
        state.healthcareHigh = +state.healthcareHigh;
        state.healthcareLow = +state.healthcareLow;
        state.id = +state.id;
        state.income = +state.income;
        state.incomeMoe = +state.incomeMoe;
        state.obesity = +state.obesity;
        state.obesityHigh = +state.obesityHigh;
        state.obesityLow = +state.obesityLow;
        state.poverty = +state.poverty;
        state.povertyMoe = +state.povertyMoe;
        state.smokes = +state.smokes;
        state.smokesHigh = +state.smokesHigh;
        state.smokesLow = +state.smokesLow;

    });
    // ===================================

    // ==================================
    // Make Scales

    // x Scale
    var xScale = d3.scaleLinear()
        .domain(d3.extent(statesData, s => s[selectedX]))
        .range([0, width]);

    // y Scale
    var yScale = d3.scaleLinear()
        .domain(d3.extent(statesData, s => s[selectedY]))
        .range([height, 0]);

    // ======================================
    // append axis

    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    // x axis
    var xAxis = chartGroup.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(bottomAxis);

    var yAxis = chartGroup.append('g')
        .call(leftAxis);

    // ========================================
    // add circles to scatter plot

    var radius = 9;

    var circleGroup = chartGroup.selectAll('circle')
        .data(statesData)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.poverty))
        .attr('cy', d => yScale(d.healthcare))
        .attr('r', radius)
        .attr('opacity', '.75')
        .classed('stateCircle', true);

    var abbrGroup = chartGroup.selectAll(null)
        .data(statesData)
        .enter()
        .append('text')
        // .attr('anchor', 'center')
        .text(d => d.abbr)
        .attr('x', d => xScale(d.poverty))
        .attr('y', d => yScale(d.healthcare) + radius / 2)
        .attr('font-size', `${radius}px`)
        .classed('stateText', true);

    // =========================================
    // add labels

    var xLabels = chartGroup.append('g')
        .attr('transform', `translate(${width / 2}, ${height + margin.top - 10})`);

    var povertyLabel = xLabels.append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('value', 'poverty')
        .classed('active', true)
        .classed('aText', true)
        .text('Poverty (%)');

    var ageLabel = xLabels.append('text')
        .attr('x', 0)
        .attr('y', 20)
        .attr('value', 'age')
        .classed('inactive', true)
        .classed('aText', true)
        .text('Age (Median)');

    var incomeLabel = xLabels.append('text')
        .attr('x', 0)
        .attr('y', 40)
        .attr('value', 'income')
        .classed('inactive', true)
        .classed('aText', true)
        .text('Household Income (Median)');

    var yLabels = chartGroup.append('g')
        .attr('transform', `rotate(-90) translate(${-height / 2}, ${-30})`);

    var healthcareLabel = yLabels.append('text')
        .attr('y', 0)
        .attr('x', 0)
        .attr('value', 'healthcare')
        .classed('active', true)
        .classed('aText', true)
        .text('Lacks Healthcare (%)');

    var smokesLabel = yLabels.append('text')
        .attr('y', -20)
        .attr('x', 0)
        .attr('value', 'smokes')
        .classed('inactive', true)
        .classed('aText', true)
        .text('Smokes (%)');

    var obeseLabel = yLabels.append('text')
        .attr('y', -40)
        .attr('x', 0)
        .attr('value', 'obesity')
        .classed('inactive', true)
        .classed('aText', true)
        .text('Obese (%)');

    // Handling change in X axis
    xLabels.selectAll('text')
        .on('click', function () {
            var value = d3.select(this).attr('value');

            if (value !== selectedX) {

                selectedX = value;
                console.log(selectedX);

                xScale = xScaler(statesData, selectedX);

                xAxis = renderXAxis(xScale, xAxis);

                circleGroup = renderXCircle(circleGroup, xScale, selectedX);

                abbrGroup = renderXAbbr(abbrGroup, xScale, selectedX);

                switch (selectedX) {

                    case 'poverty':
                        povertyLabel
                            .classed('active', true)
                            .classed('inactive', false);
                        ageLabel
                            .classed('active', false)
                            .classed('inactive', true);
                        incomeLabel
                            .classed('active', false)
                            .classed('inactive', true);
                        break;

                    case 'age':
                        povertyLabel
                            .classed('active', false)
                            .classed('inactive', true);
                        ageLabel
                            .classed('active', true)
                            .classed('inactive', false);
                        incomeLabel
                            .classed('active', false)
                            .classed('inactive', true);
                        break;

                    case 'income':
                        povertyLabel
                            .classed('active', false)
                            .classed('inactive', true);
                        ageLabel
                            .classed('active', false)
                            .classed('inactive', true);
                        incomeLabel
                            .classed('active', true)
                            .classed('inactive', false);
                        break;

                }

            }

        });

    // Handling change in Y axis
    yLabels.selectAll('text')
        .on('click', function () {
            var value = d3.select(this).attr('value');

            if (value !== selectedY) {

                selectedY = value;
                console.log(selectedY);

                yScale = yScaler(statesData, selectedY);

                yAxis = renderYAxis(yScale, yAxis);

                circleGroup = renderYCircle(circleGroup, yScale, selectedY);

                abbrGroup = renderYAbbr(abbrGroup, yScale, selectedY);

                switch (selectedY) {

                    case 'healthcare':
                        healthcareLabel
                            .classed('active', true)
                            .classed('inactive', false);
                        smokesLabel
                            .classed('active', false)
                            .classed('inactive', true);
                        obeseLabel
                            .classed('active', false)
                            .classed('inactive', true);
                        break;

                    case 'smokes':
                        healthcareLabel
                            .classed('active', false)
                            .classed('inactive', true);
                        smokesLabel
                            .classed('active', true)
                            .classed('inactive', false);
                        obeseLabel
                            .classed('active', false)
                            .classed('inactive', true);
                        break;

                    case 'obesity':
                        healthcareLabel
                            .classed('active', false)
                            .classed('inactive', true);
                        smokesLabel
                            .classed('active', false)
                            .classed('inactive', true);
                        obeseLabel
                            .classed('active', true)
                            .classed('inactive', false);
                        break;

                }

            }

        });

}).catch(function (error) {
    console.log(error);
});

