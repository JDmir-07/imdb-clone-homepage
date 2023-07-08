const input = document.querySelector(".search-box input");
const row = document.querySelector('.container .row');
const favList = document.querySelector('.movies-list');

/* 
addFavourites(id) --> to add/delete a movie from the favourites list
*/

const addFavourites = async (id) => {
    let ids = JSON.parse(localStorage.getItem('movies'))
    if (id == 'initialize') {
        if (ids == null || ids.length == 0) {
            favList.innerHTML = `<div class="empty"><h1>Add Favourites here</h1></div>`;
            localStorage.setItem('movies', JSON.stringify([]));
            return;
        }
        favList.innerHTML = '';
        for (let item of ids) {
            const li = document.createElement('li');
            li.classList.add('fav-item', 'text-white', 'm-2');
            li.setAttribute('data-id', item);
            li.innerHTML = await fetch(`http://www.omdbapi.com/?i=${item}&apikey=d19cd846`)
                .then(data => data.json())
                .then(data => `<div class="container d-flex align-items-center justify-content-between">
                    <div class="fav-information d-flex align-items-center justify-content-center">
                        <div class="fav-icon">
                            <a href="./index2.html"><img class="img-fluid" src="${data.Poster}" data-id="${item}"></a>
                        </div>
                        <div class="fav-title mx-2">
                            <p class="m-0">${data.Title}</p>
                        </div>
                    </div>
                    <div class="fav-delete">
                        <i class="fa-regular fa-trash-can" data-id="${item}" data-delete="delete"></i>
                    </div>
                </div>`)
            favList.append(li);
        }
        return;
    }
    for (let item of ids) {
        if (item == id) {
            ids = ids.filter(data => data != item);
            localStorage.setItem('movies', JSON.stringify(ids));
            for (let child of favList.children) {
                if (id == child.dataset.id) {
                    child.remove();
                    break;
                }
            }
            if (ids.length == 0) {
                favList.innerHTML = `<div class="empty"><h1>Add Favourites here</h1></div>`;
            }
            return;
        }
    }
    if (ids.length == 0) {
        favList.innerHTML = '';
    }
    localStorage.setItem('movies', JSON.stringify([...ids, id]));
    const li = document.createElement('li');
    li.classList.add('fav-item', 'text-white', 'm-2');
    li.setAttribute('data-id', id);
    li.innerHTML = await fetch(`http://www.omdbapi.com/?i=${id}&apikey=d19cd846`)
        .then(data => data.json())
        .then(data => `<div class="container d-flex align-items-center justify-content-between">
                    <div class="fav-information d-flex align-items-center justify-content-center">
                        <div class="fav-icon">
                            <a href="./index2.html"><img class="img-fluid" src="${data.Poster}" data-id="${id}"></a>
                        </div>
                        <div class="fav-title mx-2">
                            <p class="m-0">${data.Title}</p>
                        </div>
                    </div>
                    <div class="fav-delete">
                        <i class="fa-regular fa-trash-can" data-id="${id}" data-delete="delete"></i>
                    </div>
                </div>`)
    favList.append(li);
}




const deleteFavourite = (target_id) => {
    let ids = JSON.parse(localStorage.getItem('movies'));
    ids = ids.filter(id => id != target_id);
    for(let child of favList.children) {
        if (child.dataset.id == target_id) {
            child.remove();
            break;
        }
    }
    try {
        const li = document.querySelector(`[data-movie="${target_id}"]`);
        li.dataset.status = 'false';
        li.style.color = 'white';
    } catch(e) {
    }

    localStorage.setItem('movies', JSON.stringify(ids));
    if (ids.length == 0) {
        addFavourites('initialize');
    }
}


// initialize the favourites list with some default value every time the page reloads, if there was already some saved
// data then print then
addFavourites('initialize');



/*
Display all the movies that we have stored in the movies list
*/
const displayMovies = async (movies) => {
    row.innerHTML = "";
    if (movies.length == 0) {
        row.innerHTML = `<div class="empty"><h1>Search Results will appear Here !!!</h1></div>`;
        return;
    }
    for (let element of movies) {
        let item = element[0];
        let status = element[1];
        const div = document.createElement('div');
        div.classList.add('col-lg-3');
        div.classList.add('col-md-4');
        div.classList.add('col-sm-6');
        div.innerHTML = `<div class="card">
            <div class="movie-image d-flex justify-content-center aligng-items-center">
                <a href="./index2.html"><img class="img-fluid" src="${item.Poster}" data-id="${item.imdbID}"><a>
            </div>
            <div class="movie-footer px-1">
                <h4>${item.Title}</h4>
                <div class="rating-fav d-flex justify-content-between align-items-center">
                    <p><span><i class="fa-solid fa-star" style="color: #f0dc05;"></i></span> ${item.imdbRating}</p>
                    <p><i class="fa-regular fa-heart" style="color : ${!status ? 'white' : 'rgb(98, 255, 0)'}" data-movie="${item.imdbID}" data-status="${status}"></i></p>
                </div>
            </div>
        </div>`
        row.append(div);
    }


}

// initialize the search results empty and have a message on the screen with the following function call
displayMovies([])


/* 
fetchMovies(name) -> this function will make an api call to the link and get the results for the page 1

*/
async function fetchMovies(name) {
    let movies = []
    try {
        if (name.length == 0) {
            return;
        }
        var res = await fetch(`http://www.omdbapi.com/?s=${name}&page=1&apikey=d19cd846&plot=full`)
        var data = await res.json();
        if (data.Response == "True") {
            for (let item of data.Search) {
                await fetch(`http://www.omdbapi.com/?i=${item.imdbID}&apikey=d19cd846`)
                    .then(data => data.json())
                    .then(data => {
                        if (data.Poster != 'N/A' && data.Response == "True") {
                            const ids = JSON.parse(localStorage.getItem('movies'))
                            let status = false;
                            for (let element of ids) {
                                if (data.imdbID.trim() == element.trim()) {
                                    status = true;
                                    break;
                                }
                            }
                            movies.push([data, status]);
                        }
                    })
            }
        }
    } catch (e) {
    }
    await displayMovies(movies);
}

input.addEventListener('keyup', (e) => {
    fetchMovies(input.value.trim());
})


const clickHandler = (e) => {
    if (e.target.dataset.id) {
        localStorage.setItem('id', `${e.target.dataset.id}`);
    }
    if (e.target.dataset.movie) {
        e.target.style.color = e.target.dataset.status == 'false' ? 'rgb(98, 255, 0)' : 'white';
        e.target.dataset.status = e.target.dataset.status == 'true' ? false : true;
        addFavourites(e.target.dataset.movie);
    }
    if (e.target.dataset.delete) {
        deleteFavourite(e.target.dataset.id);
    }
}


document.addEventListener('click', clickHandler);