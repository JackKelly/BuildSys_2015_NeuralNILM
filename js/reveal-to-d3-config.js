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
        }        
    },
    'recurrent': {
        'init': function() {
            'use strict';
            // pt.plotNeuralNet.init('#recurrent');
        },
        0: function() {
            'use strict';
            pt.plotRecurrent.plot();
        }
    }        
};
