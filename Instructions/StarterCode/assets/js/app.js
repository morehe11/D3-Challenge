// @TODO: YOUR CODE HERE!
var svgWidth = 1000;
var svgHeight = 1000;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight + 50);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Initial Params
var chosenXAxis = "obesity";
var chosenYAxis = "age";

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenXAxis]) * 0.9,
        d3.max(data, d => d[chosenXAxis]) * 1.1
      ])
      .range([0, width]);
  
    return xLinearScale;
  
}

// function used for updating y-scale var upon click on axis label
function yScale(data, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenYAxis])-2,d3.max(data, d => d[chosenYAxis])+2])
      .range([height, 0]);
  
    return yLinearScale;
  
}
function renderXAxis(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);
  xAxis.transition()
  .duration(1000)
  .call(bottomAxis);

  return xAxis;
}
// function used for y axis
function renderYAxis(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);
  yAxis.transition()
  .duration(1000)
  .call(leftAxis);
  return yAxis;
}
// functions used for updating X axis -- Try someting similar for Y axis
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      //.attr("", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
}

// Updating text locations for the texts on X axis -- Try someting similar for Y axis
function renderXText(circlesGroup, newXScale, chosenXAxis) {
    circlesGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]));
  
    return textCircles;
}

function renderYCircles(circlesGroup, newYScale, chosenYAxis) {

  circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newYScale(d[chosenYAxis]))
       //.attr("", d => newXScale(d[chosenXAxis]));
  
  return circlesGroup;
    }
  
 // Updating text locations for the texts on X axis -- Try someting similar for Y axis
function renderYText(circlesGroup, newYScale, chosenYAxis) {
    
    circlesGroup.transition()
          .duration(1000)
          .attr("y", d => newYScale(d[chosenYAxis]));
      
        return textCircles;
    }
// function used for updating circles group 
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

    var xlabel;
    var ylabel;
  
    if (chosenXAxis === "obesity") {
      xlabel = "Obesity:";
    }
    else if (chosenXAxis === "age") {
      xlabel = "Age:";
    }
    else {
      xlabel = "smokes"
    }
    

    if (chosenYAxis === 'healthcare'){
        ylabel = "Healthcare: "
    }
    else if (chosenYAxis === 'income'){
        ylabel = "Income:"
    }
    else {
      ylabel = "Poverty"
    }

var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .style("color", "blue")
      .style("background", 'white')
      .style("border", "blue")
      .style("border-width", "20")
      .style("border-radius", "50")
      .style("padding", "10")
      .html(function(d) {
        return (`<div>${d.state}<br>${xlabel} ${d[chosenXAxis]}%<br>${ylabel} ${d[chosenYAxis]}%</div>`);
    });
  circlesGroup.call(toolTip);
  circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
    .on("mouseout", function(data, index) {
    toolTip.hide(data);
    });
  
    return circlesGroup;
}
// Read the CSV data
d3.csv("assets/data/data.csv").then(function(data, err) {
    // parse data
    data.forEach(d => {
      // convert to numbers 
	    d.poverty = +d.poverty;
      d.id = +d.id;
      d.state = d.state;
      d.poverty = +d.poverty;
      d.age = +d.age;
      d.income = +d.income;
      d.healthcare = +d.healthcare;
      d.obesity = +d.obesity;
      d.smokes = +d.smokes;
  });

// xLinearScale function above csv import
var xLinearScale = xScale(data, chosenXAxis);
// Create y scale function
var yLinearScale = yScale(data, chosenYAxis);
// Create initial axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);
// append x axis
var xAxis = chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .classed("x-axis", true)
      .call(bottomAxis);
  
    // append y axis
var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
      .call(leftAxis);
  
    // append initial circles
var circlesGroup = chartGroup.selectAll("circle")
      .data(data)
      .enter()
      .append("g");

var circles = circlesGroup.append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r",15 )
      .classed('stateCircle', true);

    // append text inside circles
var circlesText = circlesGroup.append("text")
      .text(d => d.abbr)
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("y", d => yLinearScale(d[chosenYAxis])+5) //to center the text in the circles
      .attr("dy", 5)
      .classed('stateText', true);
  
    // Create group for three x-axis labels
var xlabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
	
var obesityLabel = xlabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 20)
  .attr("value", "obesity") // value to grab for event listener
  .classed("active", true)
  .classed("aText", true)
  .text("Obesity (%)");

	// Similarly add more labels for each of the axis you want to see
var smokesLabel = xlabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 20)
  .attr("value", "smokes") // value to grab for event listener
  .classed("inactive", true)
  .classed("aText", true)
  .text("Smokes (%)");
var lacksHeathlcareLabel = xlabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 20)
  .attr("value", "healthcare low") // value to grab for event listener
  .classed("inactive", true)
  .classed("aText", true)
  .text("lacks healthcare (%)");
// Create group for three y-axis labels
var yLabelsGroup = chartGroup.append("g")
     .attr("transform", `translate(${0 - margin.left / 4}, ${height / 2})`);

var povertyLabel = yLabelsGroup.append("text")
  .attr("y", 0)
  .attr("x", 0 - 15)
  .attr("value", "poverty") // value to grab for event listener
  .classed("active", true)
  .text("Poverty (%)");

var ageLabel = yLabelsGroup.append("text")
  .attr("y", 0)
  .attr("x", 0 - 15)
  .attr("value", "age") // value to grab for event listener
  .classed("active", true)
  .text("Age (Median)");

var incomeLabel = yLabelsGroup.append("text")
  .attr("y", 0)
  .attr("x", 0 - 15)
  .attr("value", "income") // value to grab for event listener
  .classed("active", true)
  .text("Income (Median");

	// updateToolTip function above csv import
circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
	
	// With all your xLabels -- try someting similar for Y label groups as well axis
xlabelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
  
          // replaces chosenXAxis with value
          chosenXAxis = value;
          // functions here found above csv import and updates x scale for new data
          xLinearScale = xscale(data, chosenXAxis)
  
          // updates x axis with transition
          xAxis = renderXAxes(xLinearScale, xAxis)
  
          // updates circles with new x values
          circles = renderXCircles(circlesGroup, xLinearScale, chosenXAxis);
      //   updating text within circles
          circlesText = renderXCircleText(circlesText, xLinearScale, chosenXAxis);
          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
          // changes classes to change bold text
          if (chosenXAxis === "obesity") {
            obesityLabel
              .classed("active", true)
              .classed("inactive", false);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
            lacksHeathlcareLabel
              .classed("active", false)
              .classed("inactive", true);
        }
          else if (chosenXAxis === "healthcare low"){
            lacksHeathlcareLabel
              .classed("active", true)
              .classed("inactive", false);
            obesityLabel
              .classed("active", false)
              .classed("inactive", true);
            smokesLabel
              .classed("active", false)
              .classed("inactive", true);
          
        }
        else{
          smokesLabel
              .classed("active", true)
              .classed("inactive", false);
          lacksHeathlcareLabel
              .classed("active", false)
              .classed("inactive", true);
          obesityLabel
              .classed("active", false)
              .classed("inactive", true);
        }
      }
      });

      ylabelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {

            chosenYAxis = yValue; 

            yLinearScale = yScale(data, chosenYAxis);

            yAxis = renderYAxes(yLinearScale, yAxis);

            circles = renderXCircles(circlesGroup, yLinearScale, chosenYAxis);
            
            //   updating text within circles
            circlesText = renderXCircleText(circlesText, yLinearScale, chosenYAxis);
              
                      // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            if (chosenYAxis === "poverty") {
              povertyLabel
                .classed("active", true)
                .classed("inactive", false);
              ageLabel
                .classed("active", false)
                .classed("inactive", true);
              incomeLabel
                .classed("active", false)
                .classed("inactive", true);
              }
            else if (chosenYAxis === "age"){
              ageLabel
                .classed("active", true)
                .classed("inactive", false);
              povertyLabel
                .classed("active", false)
                .classed("inactive", true);
              incomeLabel
                .classed("active", false)
                .classed("inactive", true);
            }
            else {
              incomeLabel
                .classed("active", true)
                .classed("inactive", false);
              povertyLabel
                .classed("active", false)
                .classed("inactive", true);
              ageLabel
                .classed("active", false)
                .classed("inactive", true);
            }
            }
          });
        })
