let roleUpgrader = {
  run: function (creep) {
    if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.upgrading = false;
      creep.say("🔄 harvest");
    }

    if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
      creep.memory.upgrading = true;
      creep.say("⚡ upgrade");
    }

    if (!creep.memory.upgrading) {
      let sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[1], {
          visualizePathStyle: { stroke: "#ffffff" },
        });
      }
    } else {
      if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller, {
          visualizePathStyle: { stroke: "#123abc" },
        });
      }
    }
  },
};

module.exports = roleUpgrader;
