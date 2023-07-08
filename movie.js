const movieDescription = document.querySelector('.movie-description');

// displayMoviePage(data) --> this function will add the necessary html to the innerhtml of movieDescription
// element with some details also
const displayMoviePage = (data) => {
    const htmlContent = `<div class="movie">    <div class="movie-img">
        <img class="img-fluid" src="${data.Poster}">
    </div>
    <div class="movie-info text-white">
        <div class="information">
            <h2>${data.Title}</h2>
            <h6>Released : ${data.Released}</h6>
            <h6>Length : ${data.Runtime} &nbsp; <sup>${data.Type}</sup></h6>
            <p><i class="fa-solid fa-star" style="color: #f0dc05;"></i> <span>${data.imdbRating}/10</span></p>
        </div>
        
        <div class="plot">
            <p>${data.Plot}</p>
        </div>
        <div class="rtn-lgn-gen">
            <h6>Rated : ${data.Rated}</h6>
            <h6>Language : ${data.Language}</h6>
            <h6>Genre : ${data.Genre}</h6>
        </div>
    </div>
</div>`
    movieDescription.innerHTML = htmlContent;
}

// fetchMovie(id) --> this function will get the id from the localStorage and then load the specific movie that
// you have clicked on the search results index
const fetchMovie = async (id) => {
    await fetch(`http://www.omdbapi.com/?i=${id}&apikey=d19cd846`)
        .then(data => data.json())
        .then((data) => displayMoviePage(data))
}

fetchMovie(localStorage.getItem('id'));