console.log('loaded bonus.js');

// started with a copy of app.js

// initializing size of circles
var radius = 10;

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

// I set the svg to be as wide as the contianer it is in
// then I am setting its height to be a ratio of it's width
var svgWidth = scatterWidth;
var svgHeight = 3 * svgWidth / 5;

// giving it more room on the left and bottom for axis labels
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


// My initial starting axes
selectedX = 'poverty';
selectedY = 'healthcare';

// how long i want the transition to take
var clock = 1000;

// started with stubs to layout my plan

// scaler for x axis
function xScaler(statesData, selectedX) {
    console.log(`Scaling ${selectedX}`);

    var xScale = d3.scaleLinear()
        // .domain(d3.extent(statesData, s => s[selectedX]))
        // giving it some wiggle room in the edges to make it look better
        .domain([(d3.min(statesData, s => s[selectedX]) * 0.95), (d3.max(statesData, s => s[selectedX]) * 1.05)])
        .range([0, width]);

    return xScale;
}

// scaler for y axis
function yScaler(statesData, selectedY) {
    console.log(`Scaling ${selectedY}`);

    var yScale = d3.scaleLinear()
        // .domain(d3.extent(statesData, s => s[selectedY]))
        // giving it some wiggle room in the edges to make it look better
        .domain([(d3.min(statesData, s => s[selectedY]) * 0.95), (d3.max(statesData, s => s[selectedY]) * 1.05)])
        .range([height, 0]);

    return yScale;
}

// rendering new x Axis
function renderXAxis(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    // Transitioning to the new axis
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


// =================================================================
// Tool tip function

function drawToolTip(selectedX, selectedY, circleGroup) {

    // initializing all my variatbles
    // These will be the X and Y labels that go in front of the value
    var xLabel;
    var yLabel;
    // These values potenially hold a '%' depending on whether or not it is a percent value
    var pxLabel;
    var pyLabel;

    // switching for xLabel
    switch (selectedX) {
        case 'poverty':
            xLabel = 'Poverty';
            pxLabel = '%';
            break;
        
        case 'age':
            xLabel = 'Age';
            pxLabel = '';
            break;
        
        case 'income':
            xLabel = 'Income';
            pxLabel = '';
            break;
    }

    // switching for yLabel
    switch (selectedY) {
        case 'healthcare':
            yLabel = 'Healthcare';
            pyLabel = '%';
            break;
        
        case 'smokes':
            yLabel = 'Smokes';
            pyLabel = '%';
            break;

        case 'obesity':
            yLabel = 'Obesity';
            pyLabel = '%';
            break;
    }

    // here I am defining tool tip object
    var toolTip = d3.tip()
        .attr('class', 'd3-tip')
        .offset([80, -60])
        .html(function(s) {
            return (`${s.state}<br>${xLabel}: ${s[selectedX]}${pxLabel}<br>${yLabel}: ${s[selectedY]}${pyLabel}`);
        });

    // creating and appending tooltips
    circleGroup.call(toolTip);

    // I got help fixing a frustrating tooltip error from this site
    // https://github.com/caged/d3-tip/issues/231

    circleGroup.on('mouseover', function(d) {
        toolTip.show(d, this);

        // selecting just the circle that I am on
        var sCircle = d3.select(this);

        // turning off it's class to clear css
        sCircle.classed('stateCircle', false)
            // readding the css I want
            .attr('fill', '#89bdd3')
            // want i want is a different color stroke that is bigger
            .attr('stroke', 'crimson')
            .attr('stroke-width', '3');

    }).on('mouseout', function(d) {
        toolTip.hide(d);

        // selecting that cirlce again
        var sCircle = d3.select(this);

        // turning back on css which overwrites those changes i made...
        sCircle.classed('stateCircle', true)
            // ...except stroke-width so I reset that back to 1
            .attr('stroke-width', '1');
    });

    return circleGroup;
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
    var xScale = xScaler(statesData, selectedX);

    // y Scale
    var yScale = yScaler(statesData, selectedY);

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

    cirlceGroup = drawToolTip(selectedX, selectedY, circleGroup);

    // Handling change in X axis
    xLabels.selectAll('text')
        .on('click', function () {
            var value = d3.select(this).attr('value');

            // if the selected X axis has changed this runs
            if (value !== selectedX) {

                selectedX = value;
                console.log(selectedX);

                // running all the x changing functions to update the plot
                xScale = xScaler(statesData, selectedX);

                xAxis = renderXAxis(xScale, xAxis);

                circleGroup = renderXCircle(circleGroup, xScale, selectedX);

                abbrGroup = renderXAbbr(abbrGroup, xScale, selectedX);

                cirlceGroup = drawToolTip(selectedX, selectedY, circleGroup);


                // changing classes of things for css reasons
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

            // if the selected Y axis has changed this runs
            if (value !== selectedY) {

                selectedY = value;
                console.log(selectedY);

                // running all the y changing functions to update the plot
                yScale = yScaler(statesData, selectedY);

                yAxis = renderYAxis(yScale, yAxis);

                circleGroup = renderYCircle(circleGroup, yScale, selectedY);

                abbrGroup = renderYAbbr(abbrGroup, yScale, selectedY);

                cirlceGroup = drawToolTip(selectedX, selectedY, circleGroup);


                // changing classes of things for css reasons
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

