var svgWidth = 800;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 100,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#scatter")
.append("svg")
.attr("width", svgWidth)
.attr("height", svgHeight);

var chartGroup = svg.append("g")
.attr("transform", `translate(${margin.left},${margin.top})`);

d3.csv("/assets/data/data.csv").then(function(incomeData) {
    
    incomeData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;
    });

    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(incomeData, d => d.poverty)*0.9, d3.max(incomeData, d => d.poverty)*1.1])
    .range([0, width]);

    var yLinearScale = d3.scaleLinear()
    .domain([d3.min(incomeData, d => d.healthcare)*0.9, d3.max(incomeData, d => d.healthcare)*1.1])
    .range([height, 0]);

    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    var xAxis = chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    var yAxis = chartGroup.append("g")
    .call(leftAxis);

    var circlesGroup = chartGroup.append("g")
    .selectAll("circle")
    .data(incomeData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r","10")
    .attr("fill", "skyBlue");

    var textGroup = chartGroup.append("g")
    .selectAll("text")
    .data(incomeData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", (d => yLinearScale((d.healthcare))+3))
    .text(d => d.abbr)
    .attr("font-size", "10px")
    .attr("font-family","sans-serif")
    .attr("text-anchor", "middle")
    .attr("fill", "white");

    var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}%<br>Lacks Healthcare: ${d.healthcare}%`);
    });

    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data, this);
    })
    .on("mouseout", function(data, index) {
        toolTip.hide(data);
    });

    var healthcareLabel = chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 70)
    .attr("x", 0 - (height / 2))
    .attr("value", "healthcare")
    .classed("active", true)
    .text("Lacks Healthcare (%)");

    var povertyLabel = chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + 20})`)
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty")
    .classed("active", true)
    .text("In Poverty (%)");    
});
