const urlBigImagePath = "https://media.themoviedb.org/t/p/w1920_and_h600_multi_faces";
const urlSmallImagePath = "https://media.themoviedb.org/t/p/w220_and_h330_face";
const urlProviderImagePath = "https://image.tmdb.org/t/p/original/";
let countryList = [];
let countryCode = "US";
let movieList = [];
let genreList = [];
let certificationList = [];

const loadTrendingMovies = async () => {
    movieList = [];
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
    loadCertifications(movieList);
    showMovieCards(movieList);
    loadGenresList();
}

const showMovieCards = (list) => {
    document.getElementById('movie-list').innerHTML = "";
    if(list.length>0){
        changeMainBannerImage(list[0].backdrop_path);
        list.forEach((data) => addMovieCard(data));
    }else{
        showEmptyStateMovieList();
    }
}; 

const addMovieCard = (data) => {
    let movieListElement = document.getElementById('movie-list');

    let card = document.createElement("div");
    card.className = "movie-card";
    card.id = data.id;
    card.addEventListener("click", () => { showDetailsByMovie(data.id) });

    let img = document.createElement("img");
    img.className = "movie-card-image";
    img.src = `${urlSmallImagePath}${data.poster_path}`;
    card.appendChild(img);

    let ratingSection = document.createElement("div");
    ratingSection.className = "movie-card-rating-section";
    ratingSection.id = `movie-card-rating-section-${data.id}`;
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
    showCertification(data);
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

    let closeButton = document.createElement("span");
    closeButton.addEventListener("click", () => { closeDetailsByMovie() });
    closeButton.className = "modal-close-button";
    modal.appendChild(closeButton);

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
                    let categorySection = document.createElement("div");
                    categorySection.className = "modal-list-watch-providers";
                    categorySection.id = `modal-list-watch-providers-${type[0]}`;
                    let categoryElement = document.createElement("span");
                    categoryElement.innerHTML = `${type[1]}: `;
                    categoryElement.className = "modal-list-watch-provider-category";
                    categorySection.appendChild(categoryElement);
                    list.forEach(provider => {
                        let imageProvider = document.createElement("img");
                        imageProvider.className = "modal-list-watch-provider-logo";
                        imageProvider.src = `${urlProviderImagePath}${provider.logo_path}`;
                        imageProvider.alt = provider.provider_name;
                        imageProvider.title = provider.provider_name;
                        categorySection.appendChild(imageProvider);
                    });
                    modal.appendChild(categorySection);
                }
            });
        }else{
            let categorySection = document.createElement("div");
            categorySection.className = "modal-list-watch-providers";
            categorySection.id = `modal-list-watch-providers-flatrate`;
            categorySection.innerHTML = "This movie is not in this country.";
            modal.appendChild(categorySection);
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

const loadGenresList = async () => {
    let url = "https://api.themoviedb.org/3/genre/movie/list?language=en";
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
        genreList = data.genres;
    }
    showGenresFilter();
};

const showGenresFilter = () => {
    let filterSectionElement = document.getElementById("main-filter-section");
    let selectGenre = document.createElement("select");
    selectGenre.addEventListener("change", () => { changeGenreFilter(selectGenre) });
    let optionGenre = document.createElement("option");
    optionGenre.value = 0;
    optionGenre.innerHTML = "All genres";
    selectGenre.appendChild(optionGenre);
    genreList.forEach(genre => {
        let optionGenre = document.createElement("option");
        optionGenre.value = genre.id;
        optionGenre.innerHTML = genre.name;
        selectGenre.appendChild(optionGenre);
    });
    filterSectionElement.appendChild(selectGenre);
};

const changeGenreFilter = (obj) => {
    let idSearched = parseInt(obj.value);
    switch (idSearched) {
        case 0:
            //show all
            showMovieCards(movieList);
            break;
        case 10770:
            //tv movie (I dont have this genre)
            showEmptyStateMovieList();
            break;
        default:
            showMovieCards(movieList.filter(function(movie){
                return movie.genre_ids.includes(idSearched) ? true : false;
            }));
            break;
    }
};

const showEmptyStateMovieList = () => {
    document.getElementById("movie-list").innerHTML = "";
    let emptyState = document.createElement("h2");
    emptyState.className = "empty-state";
    emptyState.innerHTML = "Oops! No movies to show.";
    document.getElementById("movie-list").appendChild(emptyState);
};

const loadCertifications = async (list) => {
    let progress = 0;
    for(let movie of list){
        let url = `https://api.themoviedb.org/3/movie/${movie.id}/release_dates`;
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
            progress++;
            showLoadingBarCertifications(progress);
            data.results.forEach(val => {
                if(val.iso_3166_1==countryCode){
                    if(val.release_dates.length>0){
                        movie.certification = val.release_dates[0].certification;
                        showCertification(movie);
                    }
                }
            });
        }
    }
};

const showCertification = (movie) => {
    if(movie.certification!=undefined && movie.certification!=""){
        let ratingSectionElement = document.getElementById(`movie-card-rating-section-${movie.id}`);

        let certification = document.createElement("span");
        certification.className = "card-certification";
        certification.innerHTML = movie.certification;
        ratingSectionElement.appendChild(certification);
    }
};

const loadCertificationList = async () => {
    const url = "https://api.themoviedb.org/3/certification/movie/list";
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
        certificationList = data.certifications[countryCode];
        showCertificationFilter();
    }
};

const showCertificationFilter = () => {
    let filterSectionElement = document.getElementById("main-filter-section");
    let selectCertifications = document.createElement("select");
    selectCertifications.addEventListener("change", () => { changeCertificationFilter(selectCertifications) });
    let optionCertification = document.createElement("option");
    optionCertification.value = "All";
    optionCertification.innerHTML = "All certifications";
    selectCertifications.appendChild(optionCertification);
    certificationList.forEach(certification => {
        let optionCertification = document.createElement("option");
        optionCertification.value = certification.certification;
        optionCertification.innerHTML = certification.certification;
        selectCertifications.appendChild(optionCertification);
    });
    filterSectionElement.appendChild(selectCertifications);
    let progressBarCertification = document.createElement("span");
    progressBarCertification.id = "main-filter-progress-bar";
    progressBarCertification.innerHTML = "Loading certifications... 0%";
    filterSectionElement.appendChild(progressBarCertification);
};

const changeCertificationFilter = (obj) => {
    let certificateSearched = obj.value;
    switch (certificateSearched) {
        case "All":
            //show all
            showMovieCards(movieList);
            break;
        default:
            showMovieCards(movieList.filter(function(movie){
                return movie.certification==certificateSearched ? true : false;
            }));
            break;
    }
};

const showLoadingBarCertifications = (num) => {
    let progressBar = document.getElementById("main-filter-progress-bar");
    let total = movieList.length;
    if(total>0 && progressBar != undefined){
        let percentage = Math.round(num * 100 / total);
        progressBar.innerHTML = `Loading certifications... ${percentage}%`;
        if(num>=100){
            progressBar.remove();
        }
    }
};

//document.getElementById("header-menu-trending").addEventListener("click", () => { loadTrendingMovies() });


loadTrendingMovies();
loadCountryList();
loadCertificationList();