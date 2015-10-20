var pt = pt || {};

pt.plotPowerData = pt.plotPowerData || {};

pt.plotPowerData.svg = null;

pt.plotPowerData.init = function() {
    'use strict';

    pt.plotPowerData.x = d3.scale.linear().range([0, pt.innerWidth]);

    pt.plotPowerData.y = d3.scale.linear().range([pt.innerHeight, 0]);

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
        .x(function(d) { return pt.plotPowerData.x(d.seconds); })
        .y(function(d) { return pt.plotPowerData.y(d.watts); });

    pt.plotPowerData.svg = d3.select('#washer .placeholder')
        .append('svg')
        .attr("width", pt.outerWidth)
        .attr("height", pt.outerHeight);
    
    pt.plotPowerData.chart = pt.plotPowerData.svg.append("g")
        .attr("transform", "translate(" + pt.margin.left + "," + pt.margin.top +")");
};


pt.plotPowerData.axes = function(error, data) {
    'use strict';
    
    if (error) {
        return pt.displayError(error);
    }

    data.forEach(function(d) {
        d.seconds = +d.seconds;
        d.watts = +d.watts;  // coerce to number type.
    });
    
    pt.plotPowerData.x.domain(d3.extent(data, function(d) { return d.seconds; }));
    pt.plotPowerData.y.domain(d3.extent(data, function(d) { return d.watts; }));

    // X AXIS
    pt.plotPowerData.chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + pt.innerHeight + ")")
        .call(pt.plotPowerData.xAxis);

    // Y AXIS
    pt.plotPowerData.chart.append("g")
        .attr("class", "y axis")
        .call(pt.plotPowerData.yAxis)
      .append("text")
        .attr("y", -100)
        .attr("x", -pt.innerHeight/2)
        .attr("transform", "rotate(-90)")
        .attr("dy", ".71em")
        .style("text-anchor", "middle")
        .text("Power (watts)");

    pt.plotPowerData.chart.append("path")
        .attr("class", "line");
};


pt.plotPowerData.update = function(error, data) {
    'use strict';
    
    if (error) {
        return pt.displayError(error);
    }

    data.forEach(function(d) {
        d.seconds = +d.seconds;
        d.watts = +d.watts;  // coerce to number type.
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
    pt.plotPowerData.path1 = pt.plotPowerData.chart.select("path.line")
        .attr("d", pt.plotPowerData.lineFunction(data[0]))
      .transition()
        .duration(1000)
        .ease("linear")
        .attrTween("d", pathTweenGenerator(data));
};

pt.plotPowerData.morph = function(error, data) {
    'use strict';
    
    if (error) {
        return pt.displayError(error);
    }

    data.forEach(function(d) {
        d.seconds = +d.seconds;
        d.watts = +d.watts;  // coerce to number type.
    });
    
    // ADD LINE
    pt.plotPowerData.chart.select("path.line")
      .transition()
        .duration(500)
        .ease("linear")
        .attr("d", pt.plotPowerData.lineFunction(data))
}
