console.log('loaded bonus.js');

// started with a copy of app.js


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
selectedX = 'in_poverty';
selectedY = 'healthcare';

// started with stubs to layout my plan

// scaler for x axis
function xScaler(statesData, selectedX) {
    console.log(`Scaling ${selectedX}`);
}

// scaler for y axis
function yScaler(statesData, selectedY) {
    console.log(`Scaling ${selectedY}`);
}

function renderAxes(newXscale, newYscale, xAxis, yAxis) {
    console.log('Rendering Axes');
}

function renderCirlces(circlesGroup, newXScale, newYScale, selectedX, selectedY) {
    console.log('Rendering Circles')
}

// ==================================================================

// time to call csv
d3.csv('assets/data/data.csv').then(function(statesData, err) {
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
        .domain(d3.extent(statesData, s => s.age))
        .range([0, width]);

    // y Scale
    var yScale = d3.scaleLinear()
        .domain(d3.extent(statesData, s => s.smokes))
        .range([height, 0]);

    // ======================================
    // append axis

    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    // x axis
    chartGroup.append('g')
        .attr('transform', `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append('g')
        .call(leftAxis);

    // ========================================
    // add circles to scatter plot

    var radius = 9;

    var circleGroup = chartGroup.selectAll('circle')
        .data(statesData)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d.age))
        .attr('cy', d => yScale(d.smokes))
        .attr('r', radius)
        .attr('opacity', '.75')
        .classed('stateCircle', true);

    var fontSize = radius;
    var abbrGroup = chartGroup.selectAll(null)
        .data(statesData)
        .enter()
        .append('text')
        // .attr('anchor', 'center')
        .text(d => d.abbr)
        .attr('x', d => xScale(d.age))
        .attr('y', d => yScale(d.smokes)+fontSize/2)
        .attr('font-size', `${fontSize}px`)
        .classed('stateText', true);

    // =========================================
    // add labels
    
    var xLabels = chartGroup.append('g')
    .attr('transform', `translate(${width / 2}, ${height + margin.top - 10})`);

    var povertyLabel = xLabels.append('text')
        .attr('x', 0)
        .attr('y', 0)
        .attr('value', 'poverty')
        .attr('value', 'active')
        .classed('aText', true)
        .text('Poverty (%)');

    var ageLabel = xLabels.append('text')
        .attr('x', 0)
        .attr('y', 20)
        .attr('value', 'age')
        .attr('value', 'inactive')
        .classed('aText', true)
        .text('Age (Median)');

    var incomeLabel = xLabels.append('text')
        .attr('x', 0)
        .attr('y', 40)
        .attr('value', 'income')
        .attr('value', 'inactive')
        .classed('aText', true)
        .text('Household Income (Median)');

    var yLabels = chartGroup.append('g')
        .attr('transform', `rotate(-90) translate(${-height/2}, ${-30})`);

    var healthcareLabel = yLabels.append('text')
        .attr('y', 0)
        .attr('x', 0)
        .attr('value', 'healthcare')
        .attr('value', 'active')
        .classed('aText', true)
        .text('Lacks Healthcare (%)');

    var smokesLabel = yLabels.append('text')
        .attr('y', -20)
        .attr('x', 0)
        .attr('value', 'smokes')
        .attr('value', 'inactive')
        .classed('aText', true)
        .text('Smokes (%)');
 
    var obeseLabel = yLabels.append('text')
        .attr('y', -40)
        .attr('x', 0)
        .attr('value', 'obese')
        .attr('value', 'inactive')
        .classed('aText', true)
        .text('Obese (%)');



}).catch(function(error) {
    console.log(error);
});

