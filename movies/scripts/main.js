const urlBigImagePath = "https://media.themoviedb.org/t/p/w1920_and_h600_multi_faces";
const urlSmallImagePath = "https://media.themoviedb.org/t/p/w220_and_h330_face";
let countryList = [];
let countryCode = "US";

let movieList = [];

const showTrendingMovies = async () => {
    for(let i=1;i<=5;i++){
        let url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${i}&sort_by=popularity.desc`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZTAzOGM1NTNkNDlhNmE4Y2RmOGRmNDljMDU3YTRiNiIsInN1YiI6IjY0YTliZGQ4NjZhMGQzMDBhZGU3YjZjNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qUxIoPicoB3WgJmbCP4fEPAwQWaIEdseXKkqTXHCf20'
            }
        };
        const response = await fetch(url, options);
        if(response.ok){
            let data = await response.json();
            movieList = movieList.concat(data.results);
        }
    }
    showMovieCards(movieList);
}

const showMovieCards = (list) => {
    changeMainBannerImage(list[0].backdrop_path);
    document.getElementById('movie-list').innerHTML = "";
    list.forEach((data) => addMovieCard(data));
}; 

const addMovieCard = (data) => {
    let movieListElement = document.getElementById('movie-list');

    let card = document.createElement("div");
    card.className = "movie-card";
    card.addEventListener("click", () => { showDetailsByMovie(data.id) });

    let img = document.createElement("img");
    img.className = "movie-card-image";
    img.src = `${urlSmallImagePath}${data.poster_path}`;
    card.appendChild(img);

    let ratingSection = document.createElement("div");
    ratingSection.className = "movie-card-rating-section";
    let star = document.createElement("i");
    star.className = "star";
    ratingSection.appendChild(star);
    let rating = document.createElement("span");
    rating.className = "movie-card-rating";
    rating.innerHTML = roundToOne(data.vote_average);
    ratingSection.appendChild(rating);
    card.appendChild(ratingSection);

    let movieName = document.createElement("div");
    movieName.className = "movie-card-name";
    movieName.innerHTML = data.title;
    card.appendChild(movieName);

    let movieRelease = document.createElement("div");
    movieRelease.className = "movie-card-release-date";
    movieRelease.innerHTML = data.release_date;
    card.appendChild(movieRelease);

    movieListElement.appendChild(card);
};

const showDetailsByMovie = async (id) => {
    let body = document.querySelector("body");

    let darkScreen = document.createElement("div");
    darkScreen.addEventListener("click", () => { closeDetailsByMovie() });
    darkScreen.className = "dark-screen";
    body.appendChild(darkScreen);

    let modal = document.createElement("div");
    modal.className = "modal";
    modal.id = "modal";

    let url = `https://api.themoviedb.org/3/movie/${id}?language=en-US`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZTAzOGM1NTNkNDlhNmE4Y2RmOGRmNDljMDU3YTRiNiIsInN1YiI6IjY0YTliZGQ4NjZhMGQzMDBhZGU3YjZjNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qUxIoPicoB3WgJmbCP4fEPAwQWaIEdseXKkqTXHCf20'
        }
    };
    const response = await fetch(url, options);
    if(response.ok){
        let data = await response.json();

        let title = document.createElement("h1");
        title.innerHTML = data.title;
        modal.appendChild(title);

        let information = document.createElement("div");
        information.className = "modal-information";
        information.innerHTML = `${data.release_date}&nbsp;&nbsp;|&nbsp;&nbsp;${data.runtime} min&nbsp;&nbsp;|&nbsp;&nbsp;${roundToOne(data.vote_average)}`;
        modal.appendChild(information);

        let genresElement = document.createElement("div");
        genresElement.className = "modal-genres";
        data.genres.forEach(genre => {
            let genreElement = document.createElement("span");
            genreElement.innerHTML = genre.name;
            genresElement.appendChild(genreElement);
        });
        modal.appendChild(genresElement);

        let overview = document.createElement("div");
        overview.innerHTML = data.overview;
        modal.appendChild(overview);

        let watchProviders = document.createElement("div");
        watchProviders.id = "modal-watch-providers";
        modal.appendChild(watchProviders);

        let filterSection = document.createElement("div");
        filterSection.className ="modal-filter-section";
        let countrySelector = document.createElement("select");
        countrySelector.addEventListener("change", () => { changeCountrySelected(countrySelector,id) });
        countryList.forEach(country => {
            let option = document.createElement("option");
            option.value = country.iso_3166_1;
            option.innerHTML = `In ${country.english_name}`;
            if(countryCode == country.iso_3166_1){
                option.selected = true;
            }
            countrySelector.appendChild(option);
        });
        filterSection.appendChild(countrySelector);
        modal.appendChild(filterSection);

        loadMovieWatchProviders(id);
    }
    
    body.appendChild(modal);
};

const loadMovieWatchProviders = async (id) => {
    const types = [
        ['flatrate','Watch it on'],
        ['buy','Buy on'],
        ['rent','Rent on']
    ];

    types.forEach(type => {
        if(document.getElementById(`modal-list-watch-providers-${type[0]}`)!=undefined){
            document.getElementById(`modal-list-watch-providers-${type[0]}`).remove();
        }
    });

    const url = `https://api.themoviedb.org/3/movie/${id}/watch/providers`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZTAzOGM1NTNkNDlhNmE4Y2RmOGRmNDljMDU3YTRiNiIsInN1YiI6IjY0YTliZGQ4NjZhMGQzMDBhZGU3YjZjNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qUxIoPicoB3WgJmbCP4fEPAwQWaIEdseXKkqTXHCf20'
        }
    };
    const response = await fetch(url, options);
    if(response.ok){
        let modal = document.getElementById("modal");
        let data = await response.json();
        
        if(data.results[countryCode]!=undefined){
            types.forEach(type => {
                let list = data.results[countryCode][type[0]];
                if(list != undefined){
                    let flatrates = document.createElement("div");
                    flatrates.className = "modal-list-watch-providers";
                    flatrates.id = `modal-list-watch-providers-${type[0]}`;
                    let flatrate = document.createElement("span");
                    flatrate.innerHTML = `${type[1]}: `;
                    flatrate.className = "modal-list-watch-provider-category";
                    flatrates.appendChild(flatrate);
                    list.forEach(provider => {
                        let flatrate = document.createElement("span");
                        flatrate.innerHTML = provider.provider_name;
                        flatrates.appendChild(flatrate);
                    });
                    modal.appendChild(flatrates);
                }
            });
        }else{
            let flatrates = document.createElement("div");
            flatrates.className = "modal-list-watch-providers";
            flatrates.id = `modal-list-watch-providers-flatrate`;
            flatrates.innerHTML = "This movie is not in this country.";
            modal.appendChild(flatrates);
        }
    }
};

const closeDetailsByMovie = () => {
    document.querySelector(".dark-screen").remove();
    document.querySelector(".modal").remove();
};

const changeMainBannerImage = (url) => {
    let mainBannerElement = document.getElementById("content-main-banner");
    mainBannerElement.style.backgroundImage = `URL(${urlBigImagePath}${url})`;
};

const roundToOne = (num) => {
    let result = +(Math.round(num + "e+1") + "e-1")
    let rounded = Math.round(result);
    if(result-rounded == 0){
        result += ".0";
    }
    return result;
};

const loadCountryList = async () => {
    const url = "https://api.themoviedb.org/3/configuration/countries?language=en-US";
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzZTAzOGM1NTNkNDlhNmE4Y2RmOGRmNDljMDU3YTRiNiIsInN1YiI6IjY0YTliZGQ4NjZhMGQzMDBhZGU3YjZjNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qUxIoPicoB3WgJmbCP4fEPAwQWaIEdseXKkqTXHCf20'
        }
    };
    const response = await fetch(url, options);
    if(response.ok){
        let data = await response.json();
        countryList = data;
    }

};

const changeCountrySelected = (obj,idMovie) => {
    countryCode = obj.value;
    loadMovieWatchProviders(idMovie);
};

document.getElementById("header-menu-trending").addEventListener("click", () => { showTrendingMovies() });


showTrendingMovies();
loadCountryList();