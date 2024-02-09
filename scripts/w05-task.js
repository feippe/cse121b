/* W05: Programming Tasks */

/* Declare and initialize global variables */
const templesElement = document.getElementById("temples");
let templeList = [];


/* async displayTemples Function */
const displayTemples = (temples) => {
    temples.forEach(temple => {
        let article = document.createElement("article");
        let h3 = document.createElement("h3");
        h3.innerHTML = temple.templeName;
        let img = document.createElement("img");
        img.src = temple.imageUrl;
        img.alt = temple.location;
        article.appendChild(h3);
        article.appendChild(img);
        templesElement.appendChild(article);
    });
};


/* async getTemples Function using fetch()*/
const getTemples = async () => {
    const response = await fetch("https://byui-cse.github.io/cse121b-ww-course/resources/temples.json");
    if(response.ok){
        templeList = await response.json();
        displayTemples(templeList);
    }
};

/* reset Function */
const reset = () => {
    templesElement.innerHTML="";
};

/* filterTemples Function */
const filterTemples = (temples) => {
    reset();
    let filter = document.getElementById("filtered").value;
    switch (filter) {
        case "utah":
            displayTemples(temples.filter(function(temple){
                return temple.location.includes("Utah") ? true : false;
            }));
            break;
        case "notutah":
            displayTemples(temples.filter(function(temple){
                return temple.location.includes("Utah") ? false : true;
            }));
            break;
        case "older":
            displayTemples(temples.filter(function(temple){
                let limit = new Date(1950,0,1);
                return new Date(temple.dedicated) < limit ? true : false;
            }));
            break;
        case "all":
            displayTemples(temples);
            break;
    }
};

/* Event Listener */
document.getElementById("filtered").addEventListener("change", () => { filterTemples(templeList) });



getTemples();