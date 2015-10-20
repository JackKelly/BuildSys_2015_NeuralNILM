var pt = pt || {};

pt.plotNeuralNets = pt.plotNeuralNets || {};

pt.plotNeuralNets.svg = null;

pt.plotNeuralNets.init = function() {
    'use strict';

    var w = pt.outerWidth;
    var h = pt.outerHeight;
    
    var svg = d3.select('#neural-net-1 .placeholder')
        .append('svg')
        .attr("width", pt.outerWidth)
        .attr("height", pt.outerHeight);

    pt.plotNeuralNets.svg = svg;
    
    var color = d3.scale.category10();

    var force = d3.layout.force()
        .gravity(0)
        .charge(2)
        .size([w, h]);

    var nodes = force.nodes();

    svg.selectAll("circle")
        .data(nodes)
      .enter().append("svg:circle")
        .attr("r", 12)
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .style("fill", fill)
        .call(force.drag);

    force.on("tick", function(e) {
      var k = e.alpha * .1;
      nodes.forEach(function(node) {
        node.x += (node.targetX - node.x) * k;
        node.y += (node.targetY - node.y) * k;
      });

      svg.selectAll("circle")
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    });

    // Add first layer
    for (var i=1; i<5; i++) {
        var node = {
            layer:0,
            x:0,
            y:0,
            targetX:10,
            targetY:i*20
        };

        svg.append("svg:circle")
            .data([node])
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .attr("r", 4.5)
            .style("fill", fill);

        nodes.push(node);
        force.start();
    };

    function fill(d) {
      return color(d.layer);
    }
    
};
