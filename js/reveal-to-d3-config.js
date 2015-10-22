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
            'use strict';

            // Plot aggregate
            var xOffset = 25;
            var aggregatePlotFunc = pt.plotPowerDataVertical.init(
                pt.plotNeuralNet.svg,  // SVG
                "aggregate",           // cssID
                xOffset                // x
            );
            d3.csv('data/washer_raw.csv', aggregatePlotFunc);

            // Plot target
            var targetPlotFunc = pt.plotPowerDataVertical.init(
                pt.plotNeuralNet.svg,  // SVG
                "target",              // cssID
                800                    // x
            );
            d3.csv('data/washer_steady_states.csv', targetPlotFunc);

            // Draw 'input line'
            var y = pt.plotNeuralNet.nodes[0].targetY;
            pt.plotNeuralNet.svg.select('g.lines').append('line')
                .attr('class', 'link')
                .attr('x1', xOffset + 200)
                .attr('x2', pt.plotNeuralNet.nodes[0].targetX - 12)
                .attr('y1', y)
                .attr('y2', y)
//                .style('stroke', 'white')
                .attr('marker-end', 'url(#arrowhead)');
            
        },
        2: function() {
            pt.plotNeuralNet.svg = null;
        }
    }    
};
