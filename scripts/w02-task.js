/* W02-Task - Profile Home Page */

/* Step 1 - Setup type tasks - no code required */

/* Step 2 - Variables */
let fullName = "Gabriel Feippe";
let currentYear = new Date().getFullYear();
let profilePicture = "images/3Aw5_Pa7_300x300.jpg";


/* Step 3 - Element Variables */
let nameElement = document.getElementById('name');
let foodElement = document.getElementById('food');
let yearElement = document.querySelector('#year');
let imageElement = document.querySelector('#home picture img');


/* Step 4 - Adding Content */
nameElement.innerHTML = `<strong>${fullName}</strong>`;
yearElement.innerHTML = currentYear;
imageElement.setAttribute('src',profilePicture);
imageElement.setAttribute('alt',`Profile image of ${fullName}`);


/* Step 5 - Array */
//Declare an array variable to hold your favorite foods.
let foods = ['Meatloaf','Sorrentinos','Stuffed zucchini','Cannelloni'];

//Declare and instantiate a variable to hold another single favorite food item.
let food = 'Lasagna';

//Add the value stored in this new variable to your favorite food array.
foods.push(food);

//Append the new array values onto the displayed content of the HTML element with the id of food using a += operator and a <br> (line break character) to provide a line break as shown in Figure 2.
foodElement.innerHTML += `<br>${foods}`;

//Remove the first element in the favorite food array.
foods.shift();

//Again, append the array output showing the modified array, using a line break as shown in step 5.5.
foodElement.innerHTML += `<br>${foods}`;

//Remove the last element in the favorite food array.
foods.pop();

//Append the array output with this final modified favorite foods array. Hint: Step 5.5.
foodElement.innerHTML += `<br>${foods}`;





