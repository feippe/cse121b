const showTrendingMovies = async () => {
    let url = "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc";
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
        showMovieCards(data.results);
    }
}

const showMovieCards = (list) => {
    changeMainBannerImage(list[0].backdrop_path);
    document.getElementById('movie-list').innerHTML = "";
    list.forEach((data) => addMovieCard(data));
};

const addMovieCard = (data) => {
    let urlBaseImage = "https://media.themoviedb.org/t/p/w220_and_h330_face";
    console.log(data);
    let movieListElement = document.getElementById('movie-list');

    let card = document.createElement("div");
    card.className = "movie-card";

    let img = document.createElement("img");
    img.className = "movie-card-image";
    img.src = urlBaseImage + data.poster_path;
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

const changeMainBannerImage = (url) => {
    let urlBase = "https://media.themoviedb.org/t/p/w1920_and_h600_multi_faces";
    let mainBannerElement = document.getElementById("content-main-banner");
    mainBannerElement.style.backgroundImage = "URL("+urlBase + url+")";
};

const roundToOne = (num) => {
    let result = +(Math.round(num + "e+1") + "e-1")
    let rounded = Math.round(result);
    if(result-rounded == 0){
        result += ".0";
    }
    return result;
};


document.getElementById("header-menu-trending").addEventListener("click", () => { showTrendingMovies() });


showTrendingMovies();