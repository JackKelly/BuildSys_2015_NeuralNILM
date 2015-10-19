var pt = pt || {};

pt.slideIdToFunctions = {
    'washer': {
        'init': function() {
            'use strict';
            pt.plotPowerData.init();
        },
        '-1': function() {
            'use strict';
            d3.tsv('data.tsv', pt.plotPowerData.axes);
        },        
        0: function() {
            'use strict';
            d3.tsv('data.tsv', pt.plotPowerData.update);
        }
    }
};
