# Screeps 　スクリープス

_Started playing to learn; now playing to have fun and learn even more！_
_最初は学ぶために始めた。今は楽しむしもっと学びたい！_

## create jobs

**Game.memory.MemRooms で仕事を貯める**

## assign jobs

**assign the jobs in each room, flag jobs may be occupied by creeps that originate from other rooms**
。
**execute jobs** - do the actual action and keep doing the job until return code != 0

遠い仕事を旗で Work far with flags

## スカウト　 Scouts

-   オレンジ + オレンジ: コントローラにメッセージを張る Orange+Orange flag a controller to tag a message
-   オレンジ + 黄色:　スカウトを Orange+yellow for scout
-   オレンジ + 灰色:　スカウトを Orange+Gray for Transporter to fetch Power (CreateJobs 53)

## 戦争　 Army

-   赤 + 赤: 侍 red+red warrior
-   赤 + 青: 弓矢 red+blue gunner
-   赤 + 緑: 医者 red+green medic

## 支配者　 Claimers

-   緑 + 緑: コントローラに支配 Green+Green (controller to claim room)(broken, C1 suicides)
-   緑 + 灰色：巣を作る Green+Gray pos of new Spawn (construction 160)
-   緑 + 黄色：部屋を支配する Green+Yellow to reserve room
-   緑 + オレンジ: 支配者を移動 Green+Orange (put claimer at pos)(flag color not found)

**Summon Operator** in room

-   青 + オレンジ: blue+orange on powerspawn will spawn operater with flagName

**Activate observer**

-   オレンジ + 赤: orange+red on observer will activate the observer to scan surrounding rooms for power and deposits

**lab flag actions**

-   primary color purple 紫
    -   purple 紫 flag directly on lab, naming rules: GET-L-roomname = get lemergium from all rooms, BUY-L-roomname = get lemergium from all rooms or then buy it from the terminal
    -   white 白 flag directly on lab, naming rules: EMPTY-GH-roomname = create the mineral and allows it to be emptied from the nearby lab to this lab

**tips**
Use branches to test and debug your temporary code and also do backups.
