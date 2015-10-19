var pt = pt || {};

pt.plotPowerData = pt.plotPowerData || {};

pt.margin = {top: 20, right: 30, bottom: 30, left: 50};
pt.outer_width = 960;
pt.outer_height = 500;
pt.inner_width = pt.outer_width - pt.margin.left - pt.margin.right;
pt.inner_height = pt.outer_height - pt.margin.top - pt.margin.bottom;

pt.plotPowerData.svg = null;

pt.plotPowerData.init = function() {
    'use strict';

    pt.plotPowerData.x = d3.time.scale().range([0, pt.inner_width]);

    pt.plotPowerData.y = d3.scale.linear().range([pt.inner_height, 0]);

    pt.plotPowerData.xAxis = d3.svg.axis()
        .scale(pt.plotPowerData.x)
        .orient("bottom");

    pt.plotPowerData.yAxis = d3.svg.axis()
        .scale(pt.plotPowerData.y)
        .orient("left");

    /* lineFunction will be a function which takes data in the form
       [{date: Apr 30 2007 00:00:00 GMT+0100 (BST), close: 34.5}]
       and returns a set of paths.
    */
    pt.plotPowerData.lineFunction = d3.svg.line()
        .x(function(d) { return pt.plotPowerData.x(d.date); })
        .y(function(d) { return pt.plotPowerData.y(d.close); });

    pt.plotPowerData.svg = d3.select('#washer .placeholder')
        .append('svg')
        .attr("width", pt.outer_width)
        .attr("height", pt.outer_height);
    
    pt.plotPowerData.chart = pt.plotPowerData.svg.append("g")
        .attr("transform", "translate(" + pt.margin.left + "," + pt.margin.top +")");
};


pt.plotPowerData.axes = function(error, data) {
    'use strict';

    var parseDate = d3.time.format("%d-%b-%y").parse;
    
    if (error) {
        return pt.displayError(error);
    }

    data.reverse();

    var data2 = [];
    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.close = +d.close;  // coerce to number type.
        data2.push({date: d.date, close: d.close+50});
    });
    
    pt.plotPowerData.x.domain(d3.extent(data, function(d) { return d.date; }));
    pt.plotPowerData.y.domain(d3.extent(data, function(d) { return d.close; }));

    // X AXIS
    pt.plotPowerData.chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + pt.inner_height + ")")
        .call(pt.plotPowerData.xAxis);

    // Y AXIS
    pt.plotPowerData.chart.append("g")
        .attr("class", "y axis")
        .call(pt.plotPowerData.yAxis)
      .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Price ($)");
};


pt.plotPowerData.update = function(error, data) {
    'use strict';

    var parseDate = d3.time.format("%d-%b-%y").parse;
    
    if (error) {
        return pt.displayError(error);
    }

    data.reverse();

    var data2 = [];
    data.forEach(function(d) {
        d.date = parseDate(d.date);
        d.close = +d.close;  // coerce to number type.
        data2.push({date: d.date, close: d.close+50});
    });

    // Interpolation function
    function pathTweenGenerator(d) {
        return function pathTween() {
            /* Adapted from 
               http://big-elephants.com/2014-06/unrolling-line-charts-d3js/
               */
            var interpolate = d3.scale.quantile()
                .domain([0,1])
                .range(d3.range(1, d.length + 1));

            return function(t) {
                var slicedData = d.slice(0, interpolate(t));
                return pt.plotPowerData.lineFunction(slicedData);
            };
        };
    }
    
    // ADD LINE
    pt.plotPowerData.path1 = pt.plotPowerData.chart.append("path")
        .attr("class", "line")
        .attr("d", pt.plotPowerData.lineFunction(data[0]))
      .transition()
        .duration(10000)
        .ease("linear")
        .attrTween("d", pathTweenGenerator(data));

    pt.plotPowerData.path2 = pt.plotPowerData.chart.append("path")
        .attr("class", "line")
        .attr("d", pt.plotPowerData.lineFunction(data2[0]))
      .transition()
        .duration(5000)
        .ease("linear")
        .attrTween("d", pathTweenGenerator(data2));        
};
