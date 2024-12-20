let roleHarvester = {
  run: function (creep) {
    // if (time to live<99){
    //     move to recycle area
    // }

    if (creep.store.getFreeCapacity() > 0) {
      let sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {
          visualizePathStyle: { stroke: "#ffaa00" },
        });
      }
    } else {
      let targets = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            (structure.structureType == STRUCTURE_SPAWN ||
              // fill containers
              structure.structureType == STRUCTURE_CONTAINER ||
              structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_TOWER) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          );
        },
      });
      if (targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: "#fff111" },
          });
        }
      }
    }
  },
};
module.exports = roleHarvester;
