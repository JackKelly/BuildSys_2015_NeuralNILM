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
    'autoencoder': {
        'init': function() {
            'use strict';
            pt.plotAutoEncoder.init();
        },
        0: function() {
            'use strict';
            pt.plotAutoEncoder.plot();
        }        
    }    
};
