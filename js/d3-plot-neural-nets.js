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
        .charge(-10)
        .size([w, h]);

    var nodes = force.nodes(),
        a = {type: 0, x: 3 * w / 6, y: 2 * h / 6, fixed: true},
        b = {type: 1, x: 4 * w / 6, y: 4 * h / 6, fixed: true},
        c = {type: 2, x: 2 * w / 6, y: 4 * h / 6, fixed: true};

    nodes.push(a, b, c);

    svg.append("svg:rect")
        .attr("width", w)
        .attr("height", h);

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
        var center = nodes[node.type];
        node.x += (center.x - node.x) * k;
        node.y += (center.y - node.y) * k;
      });

      svg.selectAll("circle")
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; });
    });

    var p0;

    svg.on("mousemove", function() {
      var p1 = d3.mouse(this),
          node = {
              type: Math.random() * 3 | 0,
              x: p1[0],
              y: p1[1],
              px: (p0 || (p0 = p1))[0],
              py: p0[1]
          };

      p0 = p1;

      svg.append("svg:circle")
          .data([node])
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
          .attr("r", 4.5)
          .style("fill", fill)
        .transition()
          .delay(3000)
          .attr("r", 1e-6)
          .each("end", function() { nodes.splice(3, 1); })
          .remove();

      nodes.push(node);
      force.start();
    });

    function fill(d) {
      return color(d.type);
    }
    
};
