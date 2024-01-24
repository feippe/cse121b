// operators.js
let shipHealth = 3;
let shipAmmo = 3;
let targetHealth = 3;

function fireShip() {
  if (shipCanFire()) {
    shipAmmo--;
    if (isHit()) {
      targetHealth--;
      //console.log("hit - targetHealth:", targetHealth);
      showResult(`hit - targetHealth: ${targetHealth}`);
    } else {
      //console.log("miss");
      showResult(`miss`);
    }
  } else {
    reloadShip();
    //console.log("reloading, shipHealth:", shipHealth);
    showResult(`reloading, shipHealth: ${shipHealth}`);
  }
}

function encounter() {
  //console.log("You see a target");
  showResult(`You see a target`);
  if (!isDestroyed(targetHealth) && !isDestroyed(shipHealth)) {
    fireShip();
    if (isDestroyed(targetHealth)) {
      //console.log("Target eliminated");
      showResult(`Target eliminated`);
    }
    if (isDestroyed(shipHealth)) {
      //console.log("ship destroyed");
      showResult(`ship destroyed`);
    }
  }
}

function showResult(text){
  let datetime = (new Date()).toLocaleString();
  let container = document.getElementById('result');
  container.innerHTML = `<div><b>${datetime}</b> ${text}</div>${container.innerHTML}`;
}

//MISSING FUNCTIONS

function shipCanFire(){
  return shipHealth>0 && shipAmmo>0;
}

function isHit(){
  return Math.round(Math.random()) == 1;
}

function reloadShip(){
  if(shipAmmo==0 && !isDestroyed(targetHealth)){
    shipHealth--;
    shipAmmo = 3;
  }
}

function isDestroyed(health){
  return health<=0;
}