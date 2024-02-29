let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let inventory = ["fists"];
let monsterFighting;
let monsterHealth;
let dodged = 0;

const btn1 = document.querySelector('#btn1');
const btn2 = document.querySelector("#btn2");
const btn3 = document.querySelector("#btn3");
const xpStat = document.querySelector("#xpStat");
const healthStat = document.querySelector("#healthStat");
const goldStat = document.querySelector("#goldStat");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameStat = document.querySelector("#monsterNameStat");
const monsterHealthStat = document.querySelector("#monsterHealthStat");
const monsterLevelStat = document.querySelector("#monsterLevelStat");
const text = document.querySelector("#text");

const weapons = [
    {name: "fists", power: 2},
    {name:"dagger", power: 5}, 
    {name:"axe", power: 10},
    {name:"spear", power: 20},
    {name:"sword", power: 30}
];

const monsters = [
    {name: "Goblin", level: 5}, {name: "Orc", level: 10}, {name: "Dragon", level: 50}
];

const locations = [
    {
        name: "town",
        "button text": ["Go Store", "Go Cave", "Slay Dragon"],
        "button function": [goStore, goCave, slayDragon],
        text: "This is the town, choose where to go from here.",
    },
    {
        name: "store",
        "button text": ["Buy Health Potion \n(10 gold)", "Buy Weapon \n(30 gold)", "Go Town"],
        "button function": [buyHealth, buyWeapon, goTown],
        text: "This is the store! Use gold to gear up here!"
    },
    {
        name: "cave",
        "button text": ["Goblin", "Orc", "Go Town"],
        "button function": [fightGoblin, fightOrc, goTown],
        text: "This is the Cave! Fight Monsters here to earn gold!"
    },
    {
        name: "fight",
        "button text": ["Attack", "Dodge", "Flee"],
        "button function": [attack, dodge, flee],
        text: "You are fighting! Slay the monster to earn gold and xp!"
    },
    {
        name:"win",
        "button text": ["Go Town", "Go Town", "Go Town"],
        "button function": [goTown,goTown,goTown],
        text: "You defeated the monster!"
    },
    {
        name:"lose",
        "button text": ["You Lose", "You Lose", "You Lose"],
        "button function": [restart, restart, restart],
        text: "You died... Try again?"
    },
    {
        name: "win game",
        "button text": ["You Won!","You Won!","You Won!"],
        "button function": [restart, restart, restart],
        text: "You slayed the dragon! Play again?"
    }
];

// Initialize Buttons
btn1.onclick = goStore;
btn2.onclick = goCave;
btn3.onclick = slayDragon;

function update(location){
    monsterStats.style.display = "none";
    btn1.innerText = location["button text"][0];
    btn2.innerText = location["button text"][1];
    btn3.innerText = location["button text"][2];

    btn1.onclick = location["button function"][0];
    btn2.onclick = location["button function"][1];
    btn3.onclick = location["button function"][2];

    text.innerHTML = location["text"];
}

function goTown(){
    update(locations[0]);
}

function goStore(){
    update(locations[1]);
}

function goCave(){
    update(locations[2]);
}



function buyHealth(){
    if(gold >= 10){
        gold-=10;
        health+=10;
        goldStat.innerText=gold;
        healthStat.innerText = health;
    } else{
        text.innerText = "You Don't Have Enough Gold!"
    }
}

function buyWeapon(){
    if(currentWeapon < weapons.length - 1){
        if(gold >= 30){
            gold-=30;
            currentWeapon++;
            goldStat.innerText=gold;
            let newWeapon = weapons[currentWeapon].name
            inventory.push(newWeapon);
            text.innerText = "You just bought the " + newWeapon + "!";
            text.innerText += "\n Your current inventory: " + inventory;
        } else{
            text.innerText = "You Don't Have Enough Gold!"
        }
    }else{
        text.innerText = "You Have the Strongest Weapon!"
    }
}

function fightGoblin (){
    monsterFighting = 0;
    fight();
}

function fightOrc (){
    monsterFighting = 1;
    fight();
}

function slayDragon(){
    monsterFighting = 2;
    fight();
}

function fight(){
    update(locations[3]);
    monsterStats.style.display = "block";
    monsterNameStat.innerText = monsters[monsterFighting].name;
    monsterHealth = monsters[monsterFighting].level * 5;
    monsterHealthStat.innerText = monsterHealth;
    monsterLevelStat.innerText = monsters[monsterFighting].level;
}

function attack(){
    health -= monsterAttackDamage();
    healthStat.innerText = health;
    monsterHealth -= weaponDamage();
    monsterHealthStat.innerText = monsterHealth;
    if(health <= 0){
        lose();
    } else if (monsterHealth <=0){
        if(monsterFighting===2){
            winGame();
        } else {
            win();  
        }
    }
}

function monsterAttackDamage(){
    return(
        //Variable Monster Damage
        Math.floor(
            // Generate a random number between [0-1) multiplied by ((max value - min value + 1) + min value)
            Math.random() * ((monsters[monsterFighting].level*2) - (monsters[monsterFighting].level/2) + 1) + monsters[monsterFighting].level/2)
            
    );
}

function weaponDamage(){  
    return( 
        //Variable Weapon Damage
        Math.floor(
            // Generate a random number between [0-1) multiplied by ((max value - min value + 1) + min value)
            Math.random() * (weapons[currentWeapon].power*2 - weapons[currentWeapon].power/2 + 1) + weapons[currentWeapon].power/2
        )
        //Plus Variable Xp Damage
        + Math.floor(
            //Generate a random number between [0-1) multiplied by ((max value - min value + 1) + min value)
            Math.random() * ((xp - xp/2 + 1) + xp)
        )
    );
}

function dodge(){
    health-= 
    Math.floor(
        //Generate a random number between [0-1) multiplied by ((max value - min value + 1) + min value)
        Math.random() * ((monsters[monsterFighting].level/4 - monsters[monsterFighting].level/8 + 1) + monsters[monsterFighting].level/4) 
    )
    healthStat.innerText = health;
    if(health<=0){
        lose();
    }
    text.innerText = "You dodged an attack from the " + monsters[monsterFighting].name + "!";
    dodged++;
}

function flee(){
    //Can only Flee if player has dodged at least once
    console.log("Times dodged" + dodged);
    if (dodged >= 3){
        update(locations[0]);
        dodged = 0;
    } else {
        
    console.log("Times dodged" + dodged);
        health-= 
            Math.floor(
                //Generate a random number between [0-1) multiplied by ((max value - min value + 1) + min value)
                Math.random() * ((monsters[monsterFighting].level/2 - monsters[monsterFighting].level/4 + 1) + monsters[monsterFighting].level/4) 
            )
        text.innerText = "You can't flee unless you've dodged 3+ Attacks!"
        healthStat.innerText = health;
        if(health<=0){
            lose();
        }

    }

}

function win(){
    gold+= Math.floor(monsters[monsterFighting].level * Math.random() * 5);
    goldStat.innerText = gold;
    xp+= xpGain(); 
    xpStat.innerText = xp;
    update(locations[4])
}

function xpGain(){
    return(
        monsters[monsterFighting].level 
        - monsters[monsterFighting].level/2 
        + Math.floor(dodged/4)   
    );
}

function lose(){
    healthStat.innerText = 0;
    update(locations[5]);
}

function winGame(){
    update(locations[6]);
}

function restart(){
    xp = 0;
    health = 100;
    gold = 50;
    currentWeapon = 0;
    inventory = ["stick"];
    goldStat.innerText = gold;
    healthStat.innerText = health;
    xpStat.innerText = xp;
    goTown();
    text.innerText = "Welcome to Slay the Dragon! Your goal is to beat the Dragon. Along the way you can encounter other monsters to gain xp and gold. The gold can then be used to buy health potions or better weapons at the shop. Good Luck!";
}

