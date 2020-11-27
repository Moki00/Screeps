var roleUpgrader = {
    run: function (creep) {
        if (creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
        }

        if (
            !creep.memory.upgrading &&
            creep.carry.energy == creep.carryCapacity
        ) {
            creep.memory.upgrading = true;
        }

        if (!creep.memory.upgrading) {
            var sources = creep.room.find(FIND_SOURCES);
            if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1], {
                    visualizePathStyle: { stroke: "#ffffff" },
                });
            }
        } else {
            if (
                creep.upgradeController(creep.room.controller) ==
                ERR_NOT_IN_RANGE
            ) {
                creep.moveTo(creep.room.controller, {
                    visualizePathStyle: { stroke: "#123abc" },
                });
            }
        }
    },
};

module.exports = roleUpgrader;
