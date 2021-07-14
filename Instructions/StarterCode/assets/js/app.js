// @TODO: YOUR CODE HERE!
var svgWidth = 1000;
var svgHeight = 1000;
​
var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};
​
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;
​
// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight + 50);
​
// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
​
  // Initial Params
var chosenXAxis = "obesity";
var chosenYAxis = "age";
​
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
​
// function used for updating y-scale var upon click on axis label
function yScale(data, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(data, d => d[chosenYAxis])-2,d3.max(data, d => d[chosenYAxis])+2])
      .range([height, 0]);
  
    return yLinearScale;
  
}
​
​
// functions used for updating X axis -- Try someting similar for Y axis
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {
​
    circlesGroup.transition()
      .duration()
      .attr("cx", d => newXScale(d[chosenXAxis]))
      //.attr("", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
}
​
// Updating text locations for the texts on X axis -- Try someting similar for Y axis
function renderXText(circlesGroup, newXScale, chosenXAxis) {
​
    circlesGroup.transition()
      .duration()
      .attr("x", d => newXScale(d[chosenXAxis]));
  
    return textCircles;
}
​
​function renderYCircles(circlesGroup, newYScale, chosenYAxis) {
    ​
        circlesGroup.transition()
          .duration()
          .attr("cy", d => newYScale(d[chosenYAxis]))
          //.attr("", d => newXScale(d[chosenXAxis]));
      
        return circlesGroup;
    }
    ​
    // Updating text locations for the texts on X axis -- Try someting similar for Y axis
    function renderYText(circlesGroup, newYScale, chosenYAxis) {
    ​
        circlesGroup.transition()
          .duration()
          .attr("y", d => newYScale(d[chosenYAxis]));
      
        return textCircles;
    }
// function used for updating circles group 
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
​
    var xlabel;
    var ylabel;
  
    if (chosenXAxis === "obesity") {
      xlabel = "Obesity:";
    }
    else if (chosenXAxis === "age") {
      xlabel = "Age:";
    }
    
​
    if (chosenYAxis === 'healthcare'){
        ylabel = "Healthcare: "
    }
    else if (chosenYAxis === 'income'){
        ylabel = "Income:"
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
        return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}%<br>${ylabel} ${d[chosenYAxis]}%`);
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
​
​
// Read the CSV data
d3.csv("assets/data/data.csv").then(function(data, err) {
    
    // parse data
    data.forEach(d => {
      // convert to numbers 
	  d.poverty = +d.poverty;
      d.id = +d.id;
      d.poverty = +d.poverty;
      d.povertyMoe = +d.povertyMoe;
      d.age = +d.age;
      d.ageMoe = +d.ageMoe;
      d.income = +d.income;
      d.incomeMoe = +d.incomeMoe;
      d.healthcare = +d.healthcare;
      d.healthcareLow = +d.healthcareLow;
      d.healthcareHigh = +d.healthcareHigh;
      d.obesity = +d.obesity;
      d.obesityLow = +d.obesityLow;
      d.obesityHigh = +d.obesityHigh;
      d.smokes = +d.smokes;
      d.smokesLow = +d.smokesLow;
      d.smokesHigh = +d.smokesHigh;
  });

      
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
​
    var circles = circlesGroup.append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r",15 )
      .classed('stateCircle', true);
​
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
      .attr("value", "Obesity") // value to grab for event listener
      .classed("active", true)
      .text("Obesity (%)");
​
	// Similarly add more labels for each of the axis you want to see

	// Create group for three y-axis labels
    var yLabelsGroup = chartGroup.append("g")
     .attr("transform", "rotate(-90)");

     var ageLabel = yLabelsGroup.append("text")
     .attr("y", 0)
     .attr("x", 0 - 15)
     .attr("value", "age") // value to grab for event listener
     .classed("active", true)
     .text("Age (Median)");

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
​
        //   updating text within circles
          circlesText = renderXCircleText(circlesText, xLinearScale, chosenXAxis);
  
          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);
  
          // changes classes to change bold text
          if (chosenXAxis === "obesity") {
            obesityLabel
              .classed("active", true)
              .classed("inactive", false);
            //OtherLabel
              //.classed("active", false)
              //.classed("inactive", true);
          }
          else if(chosenXAxis === ''){
            SomeOtherlabel
              .classed("active", true)
              .classed("inactive", false);
            OtherLabe2
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
            ​
                    //   updating text within circles
            circlesText = renderXCircleText(circlesText, yLinearScale, chosenYAxis);
              
                      // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            if (chosenYAxis === "age") {
                obesityLabel
                  .classed("active", true)
                  .classed("inactive", false);
                //OtherLabel
                  //.classed("active", false)
                  //.classed("inactive", true);
              }
              else if(chosenYAxis === ''){
                SomeOtherlabel
                  .classed("active", true)
                  .classed("inactive", false);
                OtherLabe2
                  .classed("active", false)
                  .classed("inactive", true);
              }
          
            }
          });

