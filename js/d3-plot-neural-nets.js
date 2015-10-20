var pt = pt || {};

pt.plotNeuralNet = pt.plotNeuralNet || {};

pt.plotNeuralNet.svg = null;

pt.plotNeuralNet.init = function(cssID) {
    'use strict';

    var w = pt.outerWidth,
        h = pt.outerHeight;
    
    var svg = d3.select(cssID + ' .placeholder')
        .append('svg')
        .attr("width", w)
        .attr("height", h);

    pt.plotNeuralNet.svg = svg;
};

pt.plotNeuralNet.plot = function(numUnitsPerLayer, middleLayerName) {
    'use strict';

    var w = pt.outerWidth,
        h = pt.outerHeight,
        svg = pt.plotNeuralNet.svg;

    // Need to define groups for circles and lines to ensure
    // that the lines get drawn *under* the circles because
    // SVG uses document order to define Z-order.
    var lines = svg.append("g").attr("class", "lines");
    var circles = svg.append("g").attr("class", "circle");

    // Arrow heads.  Adapted from:
    // http://logogin.blogspot.co.uk/2013/02/d3js-arrowhead-markers.html
    svg.append("defs").append("marker")
        .attr("id", "arrowhead")
        .attr("refX", 6) /*must be smarter way to calculate shift*/
        .attr("refY", 2)
        .attr("markerWidth", 6)
        .attr("markerHeight", 4)
        .attr("orient", "auto")
        .append("path")
            .attr("d", "M 0,0 V 4 L6,2 Z"); //this is actual shape for arrowhead
    
    var color = d3.scale.category10();

    var force = d3.layout.force()
        .gravity(0)
        .charge(-5)
        .size([pt.outerWidth, pt.outerHeight]);

    var dx = 100, dy = 50, radius=10;
    var nodes = force.nodes();

    var numLayers = numUnitsPerLayer.length;
    var maxUnits = d3.max(numUnitsPerLayer);
    
    circles.selectAll("circle")
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

      circles.selectAll("circle")
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
        
    });
    
    // Draw neurons
    var layer = 0;    
    var timer = setInterval(addNeuron, 100);
    var xOffset = (w - ((numLayers-1) * dx)) / 2;
    function addNeuron() {
        if (layer == numLayers) {
            clearInterval(timer);
            setTimeout(addConnections, 1000);            
        };        
        var numUnits = numUnitsPerLayer[layer];

        var unitsShiftDown = ((maxUnits - numUnits) / 2) + 1;
        
        for (var i=0; i<numUnits; i++) {
            var node = {
                layer:layer,
                x:0,
                y:0,
                targetX:(layer * dx) + xOffset,
                targetY:(i+unitsShiftDown) * dy
            };
            circles.append("svg:circle")
                .data([node])
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; })
                .attr("r", radius)
                .style("fill", fill);
            nodes.push(node);
            force.start();
        }
        layer++;
    } 

    // Draw connections
    function addConnections(srcLayer, dstLayer) {
        var timer = setInterval(addConnection, 50);
        var layer = 0, unit = 0, nextLayerUnit = 0;  
        function addConnection() {
            var numUnits = numUnitsPerLayer[layer];
            var srcNode = getNode(layer, unit);
            var dstNode = getNode(layer+1, nextLayerUnit);
            var angle = Math.atan((dstNode.y - srcNode.y) / (dstNode.x - srcNode.x));
            
            lines.append("svg:line")
                .attr('x1', srcNode.x)
                .attr('y1', srcNode.y)
                .attr('x2', srcNode.x)
                .attr('y2', srcNode.y)
                .attr('class', 'link')
                .style('stroke', '#FFF')
                .attr('marker-end', 'url(#arrowhead)')            
                .transition()
                .duration(500)
                .attr('x2', dstNode.x - (Math.cos(angle) * (radius-1)))
                .attr('y2', dstNode.y - (Math.sin(angle) * (radius-1)))
                .style('stroke', '#999');

            // Increment counters
            nextLayerUnit++;
            if (nextLayerUnit == numUnitsPerLayer[layer+1]) {
                nextLayerUnit = 0;
                unit++;
                if (unit == numUnits) {
                    unit = 0;
                    layer++;
                    if (layer == numLayers-1) {
                        clearInterval(timer);
                        addLabels();
                    }
                }
            }
        }                
    }

    function addLabels() {
        function addText(text, x, y, timeout) {
            setTimeout(function() {
                svg.append("text")
                    .attr("class", "nn-label")
                    .attr("x", x)
                    .attr("y", y)
                    .attr("text-anchor", "middle")
                    .text(text)
                    .style("fill", "#222")
                    .transition()
                    .duration(500)
                    .style("fill", "#999")
            }, timeout)
            
        }
        addText("Input Layer", 180, 205, 500)
        if (middleLayerName == "Code Layer") {
            var y = h / 1.6;
        } else {
            var y = h / 1.2;
        }
        addText(middleLayerName, w / 2, y, 1000)
        addText("Output Layer", 790, 205, 1500)                
    }

    function getNode(layer, unit) {
        var nodeI = unit;
        for (var i=0; i<layer; i++) {
            nodeI += numUnitsPerLayer[i];
        }
        return nodes[nodeI];
    }
    
    function fill(d) {
      return color(d.layer);
    }
    
};
