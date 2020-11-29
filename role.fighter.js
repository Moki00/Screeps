var roleFighter = {
    run: function (creep) {
        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target) {
            if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            } else {
                creep.attack(target);
            }
        }
        // if ((creep.memory.fighting && target = alive)) {
        //     creep.memory.fighting = true;
        //     creep.say("Taste my creap!");
        // }

        // if (!creep.memory.fighting) {
        //     creep.moveTo(creep.pos.30, creep.pos.17),
        //     creep.say("Movin Out!"),
        //         {
        //             visualizePathStyle: { stroke: "#ffffff" },
        //         };
        // }
    },
};

module.exports = roleFighter;
