let roleHarvester = require("role.harvester");
let roleUpgrader = require("role.upgrader");
let roleBuilder = require("role.builder");
// let roleFighter = require("role.fighter");
// let towerManager = require("towerManager");

// every game tick runs the code below one time
module.exports.loop = function () {
  for (let name in Game.rooms) {
    console.log(
      "Room " + name + " has " + Game.rooms[name].energyAvailable + " energy ⚡"
    );
  }

  // let energy1 = Game.rooms.W59S14.energyAvailable;
  // console.log('Room "' + Game.room + '" has ' + energy1 + " energy");

  // const containersWithEnergy = room.find(FIND_STRUCTURES, {
  //     filter: (i) =>
  //         i.structureType == STRUCTURE_CONTAINER &&
  //         i.store[RESOURCE_ENERGY] > 0,
  // });

  //clear memory of the dead
  for (var name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log("Clearing non-existing creep memory:", name);
    }
  }

  //set variable for creeps, and console.log quantity
  let harvesters = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "harvester"
  );
  console.log("Harvesters: " + harvesters.length);

  //Creeps that Upgrade the RoomController
  let upgraders = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "upgrader"
  );
  console.log("Upgraders: " + upgraders.length);

  //Creeps that build
  var builders = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "builder"
  );
  console.log("Builders: " + builders.length);

  //Creeps that fight
  //   var fighters = _.filter(
  //     Game.creeps,
  //     (creep) => creep.memory.role == "fighter"
  //   );
  //   console.log("Fighters: " + fighters.length);

  // Harvesters
  if (
    //
    harvesters.length <= 0 ||
    //2nd
    (harvesters.length <= 1 && upgraders.length >= 1 && builders.length >= 1) ||
    //3rd
    (harvesters.length <= 2 && upgraders.length >= 1 && builders.length >= 2)
  ) {
    var newName = "Harvester" + Game.time;
    console.log("Spawning new harvester:" + newName);
    Game.spawns["Spawn1"].spawnCreep(
      [WORK, WORK, WORK, WORK, CARRY, MOVE, CARRY, MOVE, MOVE, MOVE], //100*4+50*6=700
      // [WORK, WORK, WORK, CARRY, MOVE], //100*3+50*2=400
      // [WORK, WORK, CARRY, MOVE], //100*2+50*3=300
      // [WORK, CARRY, MOVE], //100*+50*2=200
      newName,
      {
        memory: { role: "harvester" },
      }
    );
  }

  //  Make Upgraders
  if (
    upgraders.length <= 0 &&
    harvesters.length >= 1
    //2nd one
    // ||
    // (upgraders.length <= 1 &&
    //     harvesters.length >= 1 &&
    //     builders.length >= 1)
    // //3rd one
    // ||
    // (upgraders.length <= 2 &&
    //     harvesters.length >= 1 &&
    //     builders.length >= 1) ||
    // //4th one
    // (upgraders.length <= 3 &&
    //     harvesters.length >= 1 &&
    //     builders.length >= 1)
  ) {
    var newName = "Upgrader" + Game.time;
    console.log("Spawning new upgrader:" + newName);
    Game.spawns["Spawn1"].spawnCreep(
      [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE], //100*3+50*4=500
      // [WORK, WORK, WORK, CARRY, MOVE], //100*3+50*2=400
      // [WORK, CARRY, MOVE], //100+50*2=200
      newName,
      {
        memory: { role: "upgrader" },
      }
    );
  }

  //  Make Builders
  if (
    (builders.length <= 0 && harvesters.length >= 1 && upgraders.length >= 1) ||
    // 2nd
    (builders.length <= 1 && harvesters.length >= 2 && upgraders.length >= 1)
  ) {
    var newName = "Builder" + Game.time;
    console.log("Spawning new builder:" + newName);
    Game.spawns["Spawn1"].spawnCreep(
      // [WORK, WORK, WORK, CARRY, MOVE], //100*3+50*2=400
      [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], //100*4+50*5=650
      newName,
      {
        memory: { role: "builder" },
      }
    );
  }

  // //#3 make a Builder
  // if (
  //     (builders.length < 1 &&
  //         harvesters.length > 0 &&
  //         upgraders.length > 0) ||
  //     (builders.length < 2 &&
  //         upgraders.length > 1 &&
  //         harvesters.length > 99999)
  // ) {
  //     var newName = "Builder" + Game.time;
  //     console.log("Spawning new upgrader:" + newName);
  //     //console.log Current status of energy and creeps

  //     if (energez > 499) {
  //         Game.spawns["Spawn1"].spawnCreep(
  //             [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], //100*2+50*6=500
  //             newName,
  //             {
  //                 memory: { role: "builder" },
  //             }
  //         );
  //     } else if (energez > 349) {
  //         Game.spawns["Spawn1"].spawnCreep(
  //             [WORK, WORK, CARRY, MOVE, MOVE], //100*2+50*2=350
  //             newName,
  //             {
  //                 memory: { role: "builder" },
  //             }
  //         );
  //     } else if (energez > 299) {
  //         Game.spawns["Spawn1"].spawnCreep(
  //             [WORK, WORK, CARRY, MOVE], //100*2+50*2=300
  //             newName,
  //             {
  //                 memory: { role: "builder" },
  //             }
  //         );
  //     } else if (energez > 249) {
  //         Game.spawns["Spawn1"].spawnCreep(
  //             [WORK, CARRY, MOVE, MOVE], //100+50*3=250
  //             newName,
  //             {
  //                 memory: { role: "builder" },
  //             }
  //         );
  //     } else {
  //         Game.spawns["Spawn1"].spawnCreep(
  //             [WORK, CARRY, MOVE], //100+50*2=200
  //             newName,
  //             {
  //                 memory: { role: "builder" },
  //             }
  //         );
  //     }
  // }

  // Fighters
  //   if (fighters.length <= 0 && harvesters.length >= 1) {
  //     var newName = "Fighter" + Game.time;
  //     console.log("Spawning new fighter:" + newName);
  //     Game.spawns["Spawn1"].spawnCreep(
  //       [ATTACK, ATTACK, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE], //80*2=160, +10*4=40, +50*2=100, =300
  //       newName,
  //       {
  //         memory: { role: "fighter" },
  //       }
  //     );
  //   }

  //making creeps
  if (Game.spawns["Spawn1"].spawning) {
    var spawningCreep = Game.creeps[Game.spawns["Spawn1"].spawning.name];
    Game.spawns["Spawn1"].room.visual.text(
      "🛠️" + spawningCreep.memory.role,
      Game.spawns["Spawn1"].pos.x + 1,
      Game.spawns["Spawn1"].pos.y,
      { align: "left", opacity: 0.8 }
    );
  }

  //Tower #1
  // var towerSearch = tower.pos.findClosestByRange(FIND_STRUCTURES);
  var tower = Game.getObjectById("638e30c561ad9e219d96044b");
  if (tower) {
    var closestDamagedStructure = tower.pos.findClosestByRange(
      FIND_STRUCTURES,
      {
        filter: (structure) => structure.hits < structure.hitsMax,
      }
    );
    if (closestDamagedStructure) {
      tower.repair(closestDamagedStructure);
    }

    var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (closestHostile) {
      tower.attack(closestHostile);
    }
  }

  //This pulls the code from other files by roles
  for (var name in Game.creeps) {
    var creep = Game.creeps[name];
    if (creep.memory.role == "harvester") {
      roleHarvester.run(creep);
    }
    if (creep.memory.role == "upgrader") {
      roleUpgrader.run(creep);
    }
    if (creep.memory.role == "builder") {
      roleBuilder.run(creep);
    }
    if (creep.memory.role == "fighter") {
      roleFighter.run(creep);
    }
  }

  for (var i in Game.creeps) {
    console.log(Game.creeps[i]);
  }
};
