/* LESSON 3 - Programming Tasks */


/* Profile Object  */
let myProfile = {
    name: "Gabriel Feippe",
    photo: "images/3Aw5_Pa7_300x300.jpg",
    favoriteFoods: [
        'Fried egg',
        'Fish',
        'Pasta',
        'Chicken',
        'Ice cream'
    ],
    hobbies: [
        'Play guitar',
        'Run',
        'Soccer',
        'Read',
        'Swim'
    ],
    placesLived: []
};



/* Populate Profile Object with placesLive objects */
myProfile.placesLived.push({
    place: "Canelones",
    length: "12 years"
});

myProfile.placesLived.push({
    place: "Buenos Aires",
    length: "2 years"
});

myProfile.placesLived.push({
    place: "Montevideo",
    length: "25 years"
});



/* DOM Manipulation - Output */

/* Name */
document.getElementById('name').innerHTML = myProfile.name;

/* Photo with attributes */
document.getElementById('photo').src = myProfile.photo;
document.getElementById('photo').alt = myProfile.name;

/* Favorite Foods List*/
myProfile.favoriteFoods.forEach(food => {
    let li = document.createElement("li");
    li.textContent = food;
    document.getElementById('favorite-foods').appendChild(li);
});


/* Hobbies List */
myProfile.hobbies.forEach(hobby => {
    let li = document.createElement("li");
    li.textContent = hobby;
    document.getElementById('hobbies').appendChild(li);
});

/* Places Lived DataList */
myProfile.placesLived.forEach(place => {
    let dt = document.createElement("dt");
    dt.textContent = place.place;

    let dd = document.createElement("dd");
    dd.textContent = place.length;

    document.getElementById('places-lived').prepend(dd);
    document.getElementById('places-lived').prepend(dt);
    
});

