var roleHarvester = require("role.harvester");
var roleUpgrader = require("role.upgrader");
var roleBuilder = require("role.builder");

module.exports.loop = function () {
    //console.log Current status of energy and creeps
    for (var name in Game.rooms) {
        console.log(
            'Room "' +
                name +
                '" has ' +
                Game.rooms[name].energyAvailable +
                " energy"
        );
    }

    //clear memory of the dead
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log("Clearing non-existing creep memory:", name);
        }
    }

    //set variable for creeps, and console.log quantity
    //Creeps that harvest energy
    var harvesters = _.filter(
        Game.creeps,
        (creep) => creep.memory.role == "harvester"
    );
    console.log("Harvesters: " + harvesters.length);

    //Creeps that Upgrade the RoomController
    var upgraders = _.filter(
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

    //#1 make Harvesters
    if (harvesters.length < 1) {
        var newName = "Harvester" + Game.time;
        console.log("Spawning new harvester:" + newName);
        Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: { role: "harvester" },
        });
    }

    //#2 make an Upgrader
    if (upgraders.length < 1 && harvesters.length > 0) {
        var newName = "Upgrader" + Game.time;
        console.log("Spawning new upgrader:" + newName);
        Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: { role: "upgrader" },
        });
    }

    //#3 make a Builder
    if (builders.length < 2 && harvesters.length > 0 && upgraders.length > 0) {
        var newName = "Builder" + Game.time;
        console.log("Spawning new upgrader:" + newName);
        Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
            memory: { role: "builder" },
        });
    }

    //#4 make a Fighter-later...

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
    //   var tower = Game.getObjectById("6f59ceb98400dea83a83c286");
    //   if (tower) {
    //     var closestDamagedStructure = tower.pos.findClosestByRange(
    //       FIND_STRUCTURES,
    //       {
    //         filter: (structure) => structure.hits < structure.hitsMax,
    //       }
    //     );
    //     if (closestDamagedStructure) {
    //       tower.repair(closestDamagedStructure);
    //     }

    //     var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    //     if (closestHostile) {
    //       tower.attack(closestHostile);
    //     }
    //   }

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
    }
};
