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

pt.plotNeuralNet.plot = function(numUnitsPerLayer, middleLayerName,
                                 dy, fast, includeLabels, moveDown) {
    /*
      Parameters
      ----------
      numUnitsPerLayer : list of ints
      middleLayerName : string
      dy : float, vertical gap between neurons
      fast : bool, true if you want the animation to run quickly
      includeLabels : bool, trus if you want labels
      moveDown : number, move entire plot downwards
     */
    'use strict';
    pt.plotNeuralNet.numUnitsPerLayer = numUnitsPerLayer;
    var fast = fast || false;
    var includeLabels = (includeLabels == null ? true : includeLabels);

    var w = pt.outerWidth,
        h = pt.outerHeight,
        svg = pt.plotNeuralNet.svg;

    if (moveDown != null) {
        svg = svg.append("g").attr("transform", "translate(0," + moveDown + ")");
    }

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

    var dx = 100, dy = dy || 50, radius=10;
    var nodes = force.nodes();
    pt.plotNeuralNet.nodes = nodes;    

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

    var speed = fast ? 1.0 : 0.1;
    force.on("tick", function(e) {
        var k = e.alpha * speed;
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
    var interval = fast ? 10 : 100;
    var timer = setInterval(addNeuron, interval);
    var xOffset = (w - ((numLayers-1) * dx)) / 2;
    function addNeuron() {
        if (layer == numLayers) {
            clearInterval(timer);
            var timeout = fast ? 1000 : 1000;
            setTimeout(addConnections, timeout);            
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
    function addConnections() {
        var interval = fast ? 25 : 50;
        var timer = setInterval(addConnection, interval);
        var layer = 0, unit = 0, nextLayerUnit = 0;  
        function addConnection() {
            var numUnits = numUnitsPerLayer[layer];
            var srcNode = getNode(layer, unit);
            var dstNode = getNode(layer+1, nextLayerUnit);
            var angle = Math.atan((dstNode.y - srcNode.y) / (dstNode.x - srcNode.x));

            /* TODO: make colour transition last longer, e.g. using this trick:
               https://gist.github.com/mbostock/6081914 */
            
            var line = lines.append("svg:line")
                .attr('x1', srcNode.x)
                .attr('y1', srcNode.y)
                .attr('x2', srcNode.x)
                .attr('y2', srcNode.y)
                .attr('class', 'link')
                .style('stroke', '#FFF')
                .attr('marker-end', 'url(#arrowhead)');

            // Animate extension of line and colour
            line.transition()
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
                        if (includeLabels) {
                            addLabels();
                        }
                    }
                }
            }
        }                
    }
    
    // Labels
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
        return pt.plotNeuralNet.nodes[nodeI];
    }
    pt.plotNeuralNet.getNode = getNode;
    
    function fill(d) {
      return color(d.layer);
    }
    
};


function plotBezier(points, svg, id, duration) {
    /* Adapted from: http://bl.ocks.org/joyrexus/5715642 */
    
    var bezier = [],
        delta = .01,
        t = .0,        
        n = points.length;
    
    var line = d3.svg.line().x(x).y(y);
    var curve = svg.append("path")
        .attr("class", "curve")
        .attr("id", id);
 
    update();
    var last = 0;
    d3.timer(function(elapsed) {
        t = t + (elapsed - last) / duration;
        last = elapsed;
        update();
    });
    
    function update() {
        svg.select("#"+id).attr("d", line(getCurve()));
    }

    function getCurve() {
        if (bezier.length == 0) {
            for (var t_=0; t_<=1; t_+=delta) {
                var x = getLevels(n, t_);
                bezier.push(x[x.length-1][0]);
            }
        }
        return bezier.slice(0, t / delta + 1);
    }

    function getLevels(d, t_) {
        if (arguments.length < 2) t_ = t;
        var x = [points.slice(0, d)];
        for (var i=1; i<d; i++) {
            x.push(interpolate(x[x.length-1], t_));
        }
        return x;
    }

    function interpolate(d, p) {
        if (arguments.length < 2) p = t;
        var r = [];
        for (var i=1; i<d.length; i++) {
            var d0 = d[i-1], d1 = d[i];
            r.push(
                {x: d0.x + (d1.x - d0.x) * p,
                 y: d0.y + (d1.y - d0.y) * p}
            );
        }
        return r;
    }    
    
    function fill(d) {
      return color(d.layer);
    }

    function x(d) { return d.x; }
    function y(d) { return d.y; }
}

pt.plotNeuralNet.plotRecurrent = function(recurrentLayers, fast) {    
    'use strict';

    var fast = false || fast;
    var recurrentDuration = fast ? 20 : 250;
    var svg = pt.plotNeuralNet.svg.select("g.lines");
    if (recurrentLayers) {
        var timer = setInterval(addRecurrentConnection, recurrentDuration);
    }
    var recurrentLayerI = 0, srcUnit = 0, dstUnit = 0;  
    function addRecurrentConnection() {
        var layer = +recurrentLayers[recurrentLayerI];
        var numUnits = pt.plotNeuralNet.numUnitsPerLayer[layer];
        var srcNode = pt.plotNeuralNet.getNode(layer, srcUnit);
        var dstNode = pt.plotNeuralNet.getNode(layer, dstUnit);

        var points = [
            {x: srcNode.x, y: srcNode.y},
            {x: srcNode.x + 50, y: srcNode.y - 20},
            {x: srcNode.x + 50, y: dstNode.y + 30},
            {x: dstNode.x, y: dstNode.y}
        ];

        var id = "layer" + layer + "srcUnit" + srcUnit + "dstUnit" + dstUnit;
        plotBezier(points, svg, id, recurrentDuration);
        svg.select("#"+id)
            .transition()
            .duration(1000)
            .style("stroke", "#555");
        
        // Increment counters
        dstUnit++;
        if (dstUnit == numUnits) {
            dstUnit = 0;
            srcUnit++;
            if (srcUnit == numUnits){
                srcUnit = 0;
                recurrentLayerI++;
                if (recurrentLayerI >= recurrentLayers.length) {
                    clearInterval(timer);
                }
            }
        }
    }                            
};
