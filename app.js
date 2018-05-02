'use strict';

$(function() {
  // Setting up the chart area
  var margin = {
    top: 40,
    right: 20,
    bottom: 40,
    left: 50
  };
  var canvasWidth = 400;
  var canvasHeight = 300;
  var width = canvasWidth - margin.left - margin.right;
  var height = canvasHeight - margin.top - margin.bottom;
  var svg = d3.select('svg')
    .attr('width', canvasWidth)
    .attr('height', canvasHeight);
  // Add area for points
  var graphArea = svg.append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
  var xScale;
  var yScale;
  var dataset;

  // setup fill color
  var color = d3.scaleOrdinal(d3.schemeCategory10);

  // Step 1: edit data.csv to include the data you want to show
  d3.csv('data.csv', function(error, data) {
    if (error) {
      console.log('csv error: ', error);
      return;
    }
    dataset = data;
    console.log('read data successfully!');

    // Step 2: Create x and y scales (scaleLinear) to draw points.
    // Set xScale and yScale to the scales so you can use them outside this function.
    xScale = d3.scaleLinear().domain([8, 13]).range([0, 330]);
    yScale = d3.scaleLinear().domain([6, 12]).range([220, 0]);

    // Step 3: Add code to color the points by category (add code here or above)
    // Add X axis
    graphArea.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + (height) + ')')
      .call(d3.axisBottom(xScale));

    // Add text label for the x axis
    svg.append("text")
      .attr("transform",
        "translate(" + (width / 2) + " ," + (height + margin.top + 32) + ")")
      .attr("x", (width / 8))
      .style("text-anchor", "middle")
      .text("Crude Birth Rate (per 1k)");

    // Add Y axis
    graphArea.append('g')
      .attr('class', 'y axis')
      .text("Crude Death Rate (per 1,000)")
      .call(d3.axisLeft(yScale));

    // Add text label for the y axis
    graphArea.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Crude Death Rate (per 1k)");

    // Create circle
    graphArea.selectAll(".dot")
      .data(dataset)
      .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", function(d) {
        return xScale(d.xValue_2012);
      })
      .attr("cy", function(d) {
        return yScale(d.yValue_2012);
      })
      .style("fill", function(d) {
        return color(d.category);
      });

    // Text for the title of the plot
    graphArea.append("text")
      .attr("transform", "translate(" + width / 2 + ",-10)")
      .style("text-anchor", "middle")
      .text("Correlation between Birth and Death rate in " + year)
      .classed("title", true);

    // Add Legend
    var legend = graphArea.selectAll(".legend")
      .data(color.domain())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) {
        return "translate(0," + i * 20 + ")";
      });

    legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 16)
      .attr("height", 16)
      .style("fill", color);

    legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) {
        return d;
      });

  });

  // Animate points
  var originalYear = 2012;
  var maxYear = 2015;
  var year = originalYear;
  d3.select('#nextButton').on('click', function(event) {
    if (year == maxYear) {
      year = originalYear;
    } else {
      year = year + 1;
    }
    console.log('year: ', year);
    var xColumn = 'xValue_' + String(year); // X: CBR, Crude birth rate (per 1,000)
    var yColumn = 'yValue_' + String(year); // Y: CDR, Crude death rate (per 1,000)

    // Step 4: Animate changing the points shown by year here
    // Update all circles
    graphArea.selectAll(".dot")
      .data(dataset)
      .attr("r", 3.5)
      .transition()
      .duration(1000)
      .attr("cx", function(d) {
        return xScale(+d[xColumn]);
      })
      .attr("cy", function(d) {
        return yScale(+d[yColumn]);
      })

    //Update title
    svg.selectAll(".title")
      .text("Correlation between Birth and Death rate in " + year);

  });

});

function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /*loop through a collection of all HTML elements:*/
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /*make an HTTP request using the attribute value as the file name:*/
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;
          }
          if (this.status == 404) {
            elmnt.innerHTML = "Page not found.";
          }
          /*remove the attribute, and call this function once more:*/
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /*exit the function:*/
      return;
    }
  }
};

$(document).ready(function(){
    $("button").click(function(){
        $("p").slideToggle();
    });
    $(".dropdown-trigger").dropdown();
});
