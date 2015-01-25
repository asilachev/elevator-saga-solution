
    init: function(elevators, floors) {
        var MAX_FLOOR_NUM = floors[floors.length - 1].floorNum();
        var LOAD_FACTOR_VALUE = 0.70;

        var get_elevator = function() {
            var result = elevators[elevators.length - 1];
            for (var i=0; i<elevators.length; i++) {
                var e = elevators[i];
                if (e.loadFactor() < 0.5) {
                    return e;
                }                
                // if (e.loadFactor() < result.loadFactor()) {
                    // result = e;
                // }

            }
            return result;
        };

        var add_destination = function(e, num, obligatory) {
            var obligatory = obligatory || false;
            if (obligatory || e.loadFactor() < LOAD_FACTOR_VALUE) {
                var idx = e.destinationQueue.indexOf(num);
                if (e.destinationQueue.indexOf(num) === -1) {
                    e.destinationQueue.push(num);
                    e.checkDestinationQueue();
                }
            }
        };

        for (var i_e=0; i_e<elevators.length; i_e++) {
            var e = elevators[i_e];
            elevators.idx = i_e;
            
            e.on("floor_button_pressed", function(floorNum) {
                add_destination(this, floorNum, true);
            });

            e.on("passing_floor", function(floorNum, direction) {
                add_destination(this, floorNum);
            });

            e.on("stopped_at_floor", function(floorNum) {
                var idx = e.destinationQueue.indexOf(floorNum);
                if (e.destinationQueue.indexOf(floorNum) > -1) {
                    e.destinationQueue.splice(idx, 1);
                    e.checkDestinationQueue();
                }
            });
        }

        for (var i_f=0; i_f<floors.length; i_f++) {
            var f = floors[i_f];
            f.on("up_button_pressed", function() {
                add_destination(get_elevator(), this.floorNum());

            });
            f.on("down_button_pressed", function() {
                add_destination(get_elevator(), this.floorNum());
            });            
        }
    },
    update: function(dt, elevators, floors) {
    }   
}