console.log('loaded app.js');


// made it easy to switch between axes
// I did this because I had originally done one pair
// and I came back and wanted to do another and it seemed
// easier to just make it easy to switch between axes.

// just make the axis you want to show be the one
// that is uncommented and all others for that axis commented out.

// X Axes =================
var selectedX = 'poverty';
// var selectedX = 'age';
// var selectedX = 'income';
// =========================

// Y Axes ===================
var selectedY = 'healthcare';
// var selectedY = 'smokes';
// var selectedY = 'obesity';
// ==========================

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
    bottom: 50,
    left: 50
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

var svg = d3.select('#scatter')
    .append('svg')
    .attr('height', svgHeight)
    .attr('width', svgWidth);

var chartGroup = svg.append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

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
        .domain([d3.min(statesData, s => s[selectedX]) * 0.95, d3.max(statesData, s => s[selectedX]) * 1.05])
        .range([0, width]);

    // y Scale
    var yScale = d3.scaleLinear()
        .domain([d3.min(statesData, s => s[selectedY]) * 0.95, d3.max(statesData, s => s[selectedY]) * 1.05])
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

    // I am recycling alot of variable names from class examples
    // because they are really good and make it really easy to read
    // and understand what is happening in the code
    // ========================================
    // add circles to scatter plot

    var radius = 9;

    var circleGroup = chartGroup.selectAll('circle')
        .data(statesData)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(d[selectedX]))
        .attr('cy', d => yScale(d[selectedY]))
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
        .attr('x', d => xScale(d[selectedX]))
        .attr('y', d => yScale(d[selectedY])+fontSize/2)
        .attr('font-size', `${fontSize}px`)
        .classed('stateText', true);

    // =========================================
    // add labels

    var xLabel;
    var yLabel;

    // handle a quick change in axes
    switch (selectedX) {
        case 'poverty':
            xLabel = 'In Poverty (%)';
            break;
        
        case 'age':
            xlabel = 'Age (Median)';
            break;

        case 'income':
            xLabel = 'Household Income (Median)';
            break;
        
        default:
            xLabel = 'Something Went Wrong';
            break;
    }

    switch (selectedY) {
        case 'healthcare':
            yLabel = 'Lacks Healthcare (%)';
            break;

        case 'smokes':
            yLabel = 'Smokes (%)';
            break;

        case 'obesity':
            yLabel = 'Obese (%)';
            break;

        default:
            yLabel = 'Something Went Wrong';
            break;
    }


    // appending axes labels to chart
    chartGroup.append('text')
        .attr('transform', `translate(${width / 2}, ${height + margin.top - 10})`)
        .classed('aText', true)
        .text(xLabel);

    chartGroup.append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left + 20)
        .attr('x', 0 - (height / 2))
        // .attr('dy', '1em')
        .classed('aText', true)
        .text(yLabel);

}).catch(function(error) {
    console.log(error);
});

