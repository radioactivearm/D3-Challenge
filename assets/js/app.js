console.log('loaded app.js');

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
var svgHeight = 3 * scatterWidth / 5; 

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
});

