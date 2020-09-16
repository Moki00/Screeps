var roleUpgrader = {
    run: function(creep) {
        //if creep is working but runs out of energy
        if(creep.memory.working==true && creep.carry.energy == 0) {
            //switch state
            creep.memory.working=false;
            // creep.say('🔄 harvest');
        }
        // when creep gets full of energy
        if(creep.memory.working==false && creep.carry.energy == 50) {
            //switch state
            creep.memory.working=true;
            // creep.say('upgrade!');
        } 

        //creep to transfer energy to the Controller
        if(creep.memory.working==true) {
            // var sources = creep.room.find(FIND_SOURCES);
            //try to upgrade the Controller
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        // if creep is supposed to get more energy
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});}
        }
    }
};

module.exports = roleUpgrader;