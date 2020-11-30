var roleHarvester = require("role.harvester");
var roleUpgrader = require("role.upgrader");
var roleBuilder = require("role.builder");
let roleFighter = require("role.fighter");

module.exports.loop = function () {
    for (var name in Game.rooms) {
        console.log(
            'Room "' +
                name +
                '" has ' +
                Game.rooms[name].energyAvailable +
                " energy"
        );
    }

    // let energez = Game.rooms.W1S39.energyAvailable;
    // console.log('Room "' + Game.room + '" has ' + energez + " energezzzz");

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

    //Creeps that fight
    var fighters = _.filter(
        Game.creeps,
        (creep) => creep.memory.role == "fighter"
    );
    console.log("Fighters: " + fighters.length);

    // Harvesters
    if (
        //Temporary hurry
        harvesters.length < 1 ||
        (harvesters.length < 2 &&
            upgraders.length >= 1 &&
            builders.length >= 1) ||
        (harvesters.length <= 2 &&
            upgraders.length >= 2 &&
            builders.length >= 2)
    ) {
        var newName = "Harvester" + Game.time;
        console.log("Spawning new harvester:" + newName);
        Game.spawns["Spawn1"].spawnCreep(
            [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE], //100*4+50*4=500
            // [WORK, WORK, WORK, CARRY, MOVE], //100*3+50*2=400
            // [WORK, WORK, CARRY, MOVE], //100*2+50*3=300
            // [WORK, CARRY, MOVE], //100*+50*2=200
            newName,
            {
                memory: { role: "harvester" },
            }
        );
    }

    //#2 Upgrader Creeps
    if (
        (upgraders.length < 1 && harvesters.length > 0) ||
        //2nd one
        (upgraders.length <= 1 &&
            harvesters.length >= 1 &&
            builders.length >= 1) ||
        //3rd one
        (upgraders.length <= 2 &&
            harvesters.length >= 1 &&
            builders.length >= 1) ||
        //4th one
        (upgraders.length <= 3 &&
            harvesters.length >= 1 &&
            builders.length >= 1)
    ) {
        var newName = "Upgrader" + Game.time;
        console.log("Spawning new upgrader:" + newName);
        Game.spawns["Spawn1"].spawnCreep(
            // [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE], //100*3+50*4=500
            [WORK, WORK, WORK, CARRY, MOVE], //100*3+50*2=400
            newName,
            {
                memory: { role: "upgrader" },
            }
        );
    }

    //  Builders
    if (
        (builders.length <= 0 &&
            harvesters.length >= 1 &&
            upgraders.length >= 1) ||
        //Temp: only 1 builder for now
        (builders.length <= 1 &&
            harvesters.length >= 1 &&
            upgraders.length >= 99)
    ) {
        var newName = "Builder" + Game.time;
        console.log("Spawning new builder:" + newName);
        Game.spawns["Spawn1"].spawnCreep(
            [WORK, WORK, WORK, CARRY, MOVE], //100*3+50*2=400
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

    // Fighters: Don't need yet
    if (
        fighters.length < 1 &&
        harvesters.length >= 1 &&
        upgraders.length >= 1 &&
        builders.length >= 1
    ) {
        var newName = "Fighter" + Game.time;
        console.log("Spawning new fighter:" + newName);
        Game.spawns["Spawn1"].spawnCreep(
            [ATTACK, ATTACK, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE], //80*2=160, +10*4=40, +50*2=100, =300
            newName,
            {
                memory: { role: "fighter" },
            }
        );
    }

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
        if (creep.memory.role == "fighter") {
            roleFighter.run(creep);
        }
    }
};
