//another Upgrader

var roleUpgrader = {
  run: function (creep) {
    //make sure it has a state variable
    if (
      creep.memory.state == "MineResources" ||
      creep.memory.state == "UpgradeController"
    ) {
      //if one of these are here then we know the creep has the right state so do nothing to it
    } else {
      //Seems to be missing a state var or simply has a different state from another role
      creep.memory.state = "MineResources"; //Set it to MineResources
    }

    if (creep.memory.state === "MineResources") {
      this.MineResources(creep);
    } else if (creep.memory.state === "UpgradeController") {
      this.UpgradeController(creep);
    } else {
      //if your creep is not in any of these two states let your creep tell you
      creep.say("StateError");
    }
  }, //end of function run
  //////Second method

  MineResources: function (creep) {
    //mine the resources
    var sources = creep.room.find(FIND_SOURCES);

    if (creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
      creep.moveTo(sources[1]);
    }

    //if creep is full of energy then swap state to upgrade the controller
    if (creep.carry.energy === creep.carryCapacity) {
      creep.memory.state = "UpgradeController";
    }
  }, //end of MineResources:function(creep){
  ////////////////////third method

  UpgradeController: function (creep) {
    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller);
    }

    if (creep.carry.energy === 0) {
      //no more energy, swap states and get mining!
      creep.memory.state = "MineResources";
    }
  }, //end of UpgradeController:function(creep){
}; //end of roleupgrader
module.exports = roleUpgrader;

//multi-CARRY harvester that unloaded at multiple places until empty (requiring persistent "empty" (until completely full) and "not-empty" (until completely empty) states.
var roleHarvester = {
  run: function (creep) {
    if (creep.memory.state == "Empty" || creep.memory.state == "notEmpty") {
      //has been initialized, do nothing
    } else {
      creep.memory.state = "checkEmpty";
    }

    switch (creep.memory.state) {
      case "checkEmpty":
        if (creep.carry.energy > 0) {
          creep.memory.state = "notEmpty";
          creep.say("H1:xprtng");
        } else {
          creep.memory.state = "Empty";
          creep.say("H1:harvng");
        }
        break;
      case "notEmpty":
        var targets = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (
              (structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_SPAWN ||
                structure.structureType == STRUCTURE_TOWER) &&
              structure.energy < structure.energyCapacity
            );
          },
        });
        if (targets.length > 0) {
          if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0]);
          }
        }
        if (!targets.length > 0) {
          var stor = Game.spawns.Spawn1.room.find(FIND_STRUCTURES, {
            filter: { structureType: STRUCTURE_STORAGE },
          });
          if (stor.length > 0) {
            if (stor[0].store[RESOURCE_ENERGY] < stor[0].storeCapacity * 0.5) {
              // replenish the storage!
              if (
                creep.transfer(stor[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
              ) {
                creep.moveTo(stor[0]);
              }
            }
          }
        }
        if (creep.carry.energy == 0) {
          creep.memory.state = "Empty";
          creep.say("H1:harvng");
        }
        break;
      case "Empty":
        var sources = creep.room.find(FIND_SOURCES);
        if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(sources[0]);
        }
        if (creep.carry.energy == creep.carryCapacity) {
          creep.memory.state = "notEmpty";
          creep.say("H1:xprtng");
        }
        break;
      default:
        console.log("Invalid State!");
        creep.memory.state = "checkEmpty";
    }
  },
};

module.exports = roleHarvester;
