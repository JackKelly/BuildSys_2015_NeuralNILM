var pt = pt || {};

pt.slideIdToFunctions = {
    'washer': {
        'init': function() {
            'use strict';
            pt.plotPowerData.init();
        },
        '-1': function() {
            'use strict';
            d3.csv('data/washer_raw.csv', pt.plotPowerData.axes);
        },
        0: function() {
            'use strict';
            d3.csv('data/washer_steady_states.csv', pt.plotPowerData.update);            
        },
        1: function() {
            'use strict';
            d3.csv('data/washer_raw.csv', pt.plotPowerData.morph);
        }
    },
    'neuralnet': {
        'init': function() {
            'use strict';
            pt.plotNeuralNet.init('#neuralnet');
        },
        0: function() {
            'use strict';
            var numUnitsPerLayer = [7, 7, 5, 5, 3];
            pt.plotNeuralNet.plot(numUnitsPerLayer, "Hidden Layers");
            pt.plotNeuralNet.svg = null;            
        }        
    },    
    'autoencoder': {
        'init': function() {
            'use strict';
            pt.plotNeuralNet.init('#autoencoder');
        },
        0: function() {
            'use strict';
            var numUnitsPerLayer = [7, 5, 3, 5, 7];            
            pt.plotNeuralNet.plot(numUnitsPerLayer, "Code Layer");
            pt.plotNeuralNet.svg = null;            
        }
    },
    'recurrent': {
        'init': function() {
            'use strict';
            pt.plotNeuralNet.init('#recurrent');
        },
        0: function() {
            'use strict';
            var numUnitsPerLayer = [1, 5, 5, 3, 1];
            var dy = 70;
            pt.plotNeuralNet.plot(numUnitsPerLayer, "Recurrent Layers", dy);
        },
        1: function() {
            'use strict';
            pt.plotNeuralNet.plotRecurrent([1,2]);
            pt.plotNeuralNet.svg = null;
        }        
    },
    'rnns-for-nilm': {
        'init': function() {
            'use strict';
            pt.plotNeuralNet.init('#rnns-for-nilm');
        },
        0: function() {
            'use strict';
            var numUnitsPerLayer = [1, 5, 5, 3, 1];
            var dy = 70;
            var fast = true;
            var includeLabels = false;
            pt.plotNeuralNet.plot(numUnitsPerLayer, "Recurrent Layers", dy, fast, includeLabels);
            setTimeout(
                function() {
                    pt.plotNeuralNet.plotRecurrent([1,2], fast);
                },
                1000
            );
        },
        1: function() {
            // Draw 'input line'
            var xOffset = 25;            
            var y = pt.plotNeuralNet.nodes[0].targetY;
            pt.plotNeuralNet.svg.select('g.lines').append('line')
                .attr('class', 'link')
                .attr('x1', xOffset)
                .attr('x2', pt.plotNeuralNet.nodes[0].targetX - 12)
                .attr('y1', y)
                .attr('y2', y)
                .attr('marker-end', 'url(#arrowhead)');

            // Draw 'output line'
            var xOffset = 25;
            var lastNode = pt.plotNeuralNet.nodes[pt.plotNeuralNet.nodes.length-1];
            var y = lastNode.targetY;
            pt.plotNeuralNet.svg.select('g.lines').append('line')
                .attr('class', 'link')
                .attr('x1', lastNode.targetX + 12)
                .attr('x2', 790)
                .attr('y1', y)
                .attr('y2', y)
                .attr('marker-end', 'url(#arrowhead)');
            
            pt.plotNeuralNet.svg.append("text")
                .attr("x", 10)
                .attr("y", 20)
                .attr("class", "nn-label")
                .text("Aggregate input");
            
            pt.plotNeuralNet.svg.append("text")
                .attr("x", 800)
                .attr("y", 20)
                .attr("class", "nn-label")
                .text("Target output");            
            
        },
        2: function() {
            'use strict';

            // Plot aggregate
            var xOffset = 25;
            var aggregatePlotFunc = pt.plotPowerDataVertical.init(
                pt.plotNeuralNet.svg,  // SVG
                "aggregate",           // cssID
                xOffset                // x
            );
            d3.csv('data/mains.csv', aggregatePlotFunc);

            // Plot target
            var yClip = pt.plotNeuralNet.nodes[pt.plotNeuralNet.nodes.length-1].targetY;
            var targetPlotFunc = pt.plotPowerDataVertical.init(
                pt.plotNeuralNet.svg,  // SVG
                "target",              // cssID
                800,                   // x
                yClip
            );
            d3.csv('data/washer_disag_target.csv', targetPlotFunc);            
        },
        3: function() {
            pt.plotNeuralNet.svg = null;
        }
    },
    'autoencoder-for-nilm': {
        'init': function() {
            'use strict';
            pt.plotNeuralNet.init('#autoencoder-for-nilm');
        },
        0: function() {
            'use strict';
            var numUnitsPerLayer = [7, 5, 3, 5, 7];
            var dy = 40;
            var fast = true;
            var includeLabels = false;
            var moveDown = 100;
            pt.plotNeuralNet.plot(
                numUnitsPerLayer, "Code Layer", dy, fast, includeLabels, moveDown);
        },
        1: function() {
            // Input rectangle
            pt.plotNeuralNet.svg.append("rect")
                .attr("width", 230)
                .attr("height", 320)
                .attr("x", 25)
                .attr("y", 100)
                .attr("fill", "#999")
                .attr("fill-opacity", 0.4);

            // Output rectangle
            pt.plotNeuralNet.svg.append("rect")
                .attr("width", 230)
                .attr("height", 320)
                .attr("x", 750)
                .attr("y", 100)
                .attr("fill", "#999")
                .attr("fill-opacity", 0.4);

            pt.plotNeuralNet.svg.append("text")
                .attr("x", 40)
                .attr("y", 20)
                .attr("class", "nn-label")
                .text("Aggregate input");
            
            pt.plotNeuralNet.svg.append("text")
                .attr("x", 800)
                .attr("y", 20)
                .attr("class", "nn-label")
                .text("Target output");            
            
        },
        2: function() {
            'use strict';

            // Plot aggregate
            var xOffset = 25;
            var jerkUp = true;
            var aggregatePlotFunc = pt.plotPowerDataVertical.init(
                pt.plotNeuralNet.svg,  // SVG
                "aggregateAE",         // cssID
                xOffset,               // x
                null,
                jerkUp
            );
            d3.csv('data/mains.csv', aggregatePlotFunc);

            // Plot target
            var callback = function() {
                pt.plotNeuralNet.svg = null;
            }
            var yClip = pt.plotNeuralNet.nodes[pt.plotNeuralNet.nodes.length-1].targetY;
            var targetPlotFunc = pt.plotPowerDataVertical.init(
                pt.plotNeuralNet.svg,  // SVG
                "targetAE",              // cssID
                760,                   // x
                null,
                jerkUp,
                callback
            );
            d3.csv('data/washer_disag_target.csv', targetPlotFunc);            
        }
    },
    'rectangles-for-nilm': {
        'init': function() {
            'use strict';
            pt.plotNeuralNet.init('#rectangles-for-nilm');
        },
        0: function() {
            'use strict';
            var numUnitsPerLayer = [7, 7, 5, 5, 3];
            var dy = 40;
            var fast = true;
            var includeLabels = false;
            var moveDown = 100;
            pt.plotNeuralNet.plot(
                numUnitsPerLayer, "Hidden Layers", dy, fast, includeLabels, moveDown);
        },
        1: function() {
            // Input rectangle
            pt.plotNeuralNet.svg.append("rect")
                .attr("width", 230)
                .attr("height", 320)
                .attr("x", 25)
                .attr("y", 100)
                .attr("fill", "#999")
                .attr("fill-opacity", 0.4);

            // Output rectangle
            pt.plotNeuralNet.svg.append("rect")
                .attr("width", 230)
                .attr("height", 320)
                .attr("x", 750)
                .attr("y", 100)
                .attr("fill", "#999")
                .attr("fill-opacity", 0.4);

            pt.plotNeuralNet.svg.append("text")
                .attr("x", 40)
                .attr("y", 20)
                .attr("class", "nn-label")
                .text("Aggregate input");
            
            pt.plotNeuralNet.svg.append("text")
                .attr("x", 800)
                .attr("y", 20)
                .attr("class", "nn-label")
                .text("Target output");            
            
        },
        2: function() {
            'use strict';

            // Plot aggregate
            var xOffset = 25;
            var jerkUp = true;
            var aggregatePlotFunc = pt.plotPowerDataVertical.init(
                pt.plotNeuralNet.svg,  // SVG
                "aggregateRectangles", // cssID
                xOffset,               // x
                null,
                jerkUp
            );
            d3.csv('data/mains.csv', aggregatePlotFunc);

            // Plot target
            var callback = function() {
                pt.plotNeuralNet.svg = null;
            }
            var yClip = pt.plotNeuralNet.nodes[pt.plotNeuralNet.nodes.length-1].targetY;
            var targetPlotFunc = pt.plotPowerDataVertical.init(
                pt.plotNeuralNet.svg,  // SVG
                "targetRectangles",    // cssID
                760,                   // x
                null,
                jerkUp,
                callback,
                true  // plot rectangle
            );
            d3.csv('data/washer_disag_target.csv', targetPlotFunc);
        }
    }    
};
