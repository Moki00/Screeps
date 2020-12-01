# Screeps 　スクリープス

_Just playing for fun_
楽しもう

**create jobs** - Game.memory.MemRooms で仕事を貯める
**assign jobs** - assign the jobs in each room, flag jobs may be occupied by creeps that originate from other rooms
**execute jobs** - do the actual action and keep doing the job until return code != 0

遠い仕事を旗で

## スカウト　 Scouts

-   オレンジ + オレンジ: tag a controller with a scout - flag name is tag message
-   オレンジ + 黄色 for scout at pos

## 戦争　 Army

-   赤 + 赤: warrior at pos
-   赤 + 青: gunner at pos
-   赤 + 緑: medic at pos

## 支配者　 Claimers

-   緑 + 緑: claimer claim room on controller
-   緑 + 黄色: reserve room
-   緑 + オレンジ: claimer at pos

    primary color 緑 and secondary color 灰色

**Summon Operator** in room

-   青 + オレンジ: on powerspawn will spawn operater with flagname

**Activate observer**

-   オレンジ　 ⁺ 　赤 on observer will activate the observer to scan surrounding rooms for power and deposits

**lab flag actions**

-   primary color purple 紫
    -   purple flag directly on lab, naming rules: GET-L-roomname = get lemergium from all rooms, BUY-L-roomname = get lemergium from all rooms or then buy it from the terminal
    -   white flag directly on lab, naming rules: EMPTY-GH-roomname = create the mineral and allows it to be emptied from the nearby lab to this lab
