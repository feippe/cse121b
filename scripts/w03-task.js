/* LESSON 3 - Programming Tasks */

/* FUNCTIONS */
/* Function Definition - Add Numbers */
function add(number1, number2){
    return number1 + number2;
}
function addNumbers(){
    let number1 = Number(document.getElementById('add1').value);
    let number2 = Number(document.getElementById('add2').value);
    document.getElementById('sum').value = add(number1, number2);
}
document.getElementById("addNumbers").addEventListener("click", addNumbers);

/* Function Expression - Subtract Numbers */
let subtract = function(subtract1, subtract2){
    return subtract1 - subtract2;
};
let subtractNumbers = function(){
    let subtract1 = Number(document.getElementById('subtract1').value);
    let subtract2 = Number(document.getElementById('subtract2').value);
    document.getElementById('difference').value = subtract(subtract1, subtract2);
};
document.getElementById("subtractNumbers").addEventListener("click", subtractNumbers);

/* Arrow Function - Multiply Numbers */
let multiply = (factor1, factor2) => factor1 * factor2;
let multiplyNumbers = () => {
    let factor1 = Number(document.getElementById('factor1').value);
    let factor2 = Number(document.getElementById('factor2').value);
    document.getElementById('product').value = multiply(factor1, factor2);
};
document.getElementById("multiplyNumbers").addEventListener("click", multiplyNumbers);

/* Open Function Use - Divide Numbers */
let divide = (dividend, divisor) => dividend / divisor;
let divideNumbers = function(){
    let dividend = Number(document.getElementById('dividend').value);
    let divisor = Number(document.getElementById('divisor').value);
    document.getElementById('quotient').value = divide(dividend, divisor);
};
document.getElementById("divideNumbers").addEventListener("click", divideNumbers);

/* Decision Structure */
let getTotalDue = ()=>{
    let subtotal = Number(document.getElementById("subtotal").value);
    let membershipInput = document.getElementById("member").checked;
    if(membershipInput){
        subtotal = subtotal * 0.8;
    }
    subtotal = subtotal.toFixed(2);
    document.getElementById("total").innerHTML = `$ ${subtotal}`;
};
document.getElementById("getTotal").addEventListener("click", getTotalDue);

/* ARRAY METHODS - Functional Programming */
/* Output Source Array */
let numbersArray = [];
for(var i=1; i<=13;i++){
    numbersArray.push(i);
}
document.getElementById('array').innerHTML = numbersArray;

/* Output Odds Only Array */
document.getElementById('odds').innerHTML = numbersArray.filter((number) => number % 2);

/* Output Evens Only Array */
document.getElementById('evens').innerHTML = numbersArray.filter((number) => !(number % 2));

/* Output Sum of Org. Array */
document.getElementById('sumOfArray').innerHTML = numbersArray.reduce( (total, number) => total + number );

/* Output Multiplied by 2 Array */
document.getElementById('multiplied').innerHTML = numbersArray.map((number) => number * 2);

/* Output Sum of Multiplied by 2 Array */
let multiplyArray = numbersArray.map((number) => number * 2);
let totalMultiply = multiplyArray.reduce((total, number)=>total+number);
document.getElementById('sumOfMultiplied').innerHTML = totalMultiply;

