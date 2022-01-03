let title_categorie_1 ="Action";
let title_categorie_2 ="Adult";
let title_categorie_3 ="Adventure";
let title_categorie_4 ="Animation";
let title_categorie_5 ="Biography";

class Carousel {

	/**
	 * constructor of the Carousel class
	 * @param {HTMLElement} element 
	 * @param {Object} options 
	 * @param {Object} options.slidesToScroll number of slides to scroll
	 */
	constructor(categorie, element, options = {}) {
		this.categorie = categorie;
		this.prevButton = categorie.querySelector("div.carousel_prev");
		this.nextButton = categorie.querySelector("div.carousel_next");
		this.carouselmod = element;
		this.currentSlide = 0;
		this.options = Object.assign({}, {
			slidesToScroll: 1
		}, options);
		this.createNavigation();
	}

	/**
	 * method that creates navigation button
	 */
	createNavigation() {
		this.prevButton.addEventListener('click', this.prev.bind(this));
		this.nextButton.addEventListener('click', this.next.bind(this));
	}

	next() {
		this.gotoItem(this.currentSlide + this.options.slidesToScroll);
	}

	prev() {
		this.gotoItem(this.currentSlide - this.options.slidesToScroll);
	}

	/**
	 * Move the carouselmod to the index number
	 * @param {number} index 
	 */
	gotoItem(index) {
		console.log(index)
		if (index <= -this.carouselmod.children.length || index == 1) {
			index = 0;
		}
		let translateX = index * 100 / (this.carouselmod.children.length);
		this.carouselmod.style.transform = 'translate3d(' + translateX + '%,0,0)';
		this.currentSlide = index;
	}
}
/**
 * When DOM loaded 
 */

 window.addEventListener("DOMContentLoaded", (event) => {
    /** Fetch data for each casourel */
    bestMovieRecorded();
    romanticMovies();
    twoThousandMovies();
    bradMovies();
    console.log("DOM entièrement chargé et analysé");
    /** Instances each carrousel */
    new Carousel(document.getElementById("video_best"), document.querySelector("#car_categorie_1"), {
        slidesToScroll: 2
    });
    new Carousel(document.getElementById("categorie_romance"), document.querySelector("#carousel_romance"), {
        slidesToScroll: 2
    });
    new Carousel(document.getElementById("categorie_two_thousand"), document.querySelector("#carousel_two_thousand"), {
        slidesToScroll: 2
    });
    new Carousel(document.getElementById("categorie_brad"), document.querySelector("#carousel_brad"), {
        slidesToScroll: 2
    });
    var myModal = document.querySelector("#myModal");
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        myModal.style.display = "none";
    }

});

/**
 * function that load data of a movie
 */
 function getMovieData(movie_url_des) {
    fetch(movie_url_des)
        .then((res) => res.json())
        .then((res) => {
            movie_title = res.original_title;
            movie_type = res.genres;
            movie_des = res.description;
            movie_url = res.image_url;
            movie_release_date = res.date_published;
            movie_rated = res.rated;
            movie_imbd = res.imdb_score;
            movie_directors = res.directors;
            movie_actors = res.actors;
            movie_duration = res.duration;
            movie_countries = res.countries;
            movie_votes = res.avg_vote;
            document
                .getElementById("movie_data")
                .innerHTML = `
                    <div><img src= ${movie_url} alt='movie'></img></div>
                    <div><H2>${movie_title}</H2>
                        <p> <B>Durée :</B>${movie_duration}</p>
                        <p> <B>Genre : </B> ${movie_type} </p>
                        <p> <B>Date de sortie : </B>${movie_release_date}</p>
                        <p> <B>Moyenne des votes :</B> ${movie_rated} </p>
                        <p> <B>Score Imbd :</B> ${movie_rated}</p>
                        <p> <B>Réalisateur :</B>${movie_directors}</p>
                        <p> <B>Pays d'origine : </B> ${movie_countries} </p>
                        <p> <B>Liste des acteurs :</B> ${movie_actors}</p>
                        <p> <B>Résultat box office : </B> ${movie_votes} </p>
                        <p> <B>Résumé :</B> ${movie_des} </p>
                    </div>`
        });
}

/**
 * 
 * function that load the 10 first best movies (avec imbd)
 */

function bestMovie() {
    fetch('http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&page_size=10&page=1')
        .then(res => res.json())
        .then(res => res.results)
        .then(function(value) {
            let bestMovie_url = value[0].image_url;
            let bestMovie_name = value[0].title;
            let bestMovie_url_des = value[0].url;
            let bestMovie_des = "";
            fetch(bestMovie_url_des)
                .then((res) => res.json())
                .then((res) => {
                    bestMovie_des = res.description;
                    document
                        .getElementById("video_to_show")
                        .innerHTML = `
                <div><img src= ${bestMovie_url} alt='current_video'></img></div>
                <div><H3>${bestMovie_name}</H3>
                    <p>${bestMovie_des}</p>
                </div>`;
                });
            var btn = document.querySelector("#best_movie");
            btn.onclick = function() {
                myModal.style.display = "block";
                getMovieData(bestMovie_url_des);
            }
            for (let i = 1; i < value.length; i++) {
                let movie = value[i].image_url;
                let name = value[i].id;
                let movie_url = value[i].url;
                //console.log(movie);
                let elt = document.getElementById("carousel_best_movies");
                let elt_item = document.createElement('div');
                elt_item.setAttribute('class', 'casourel_item');
                elt.appendChild(elt_item);
                let div = document.createElement('div');
                div.setAttribute('id', name);
                div.innerHTML = `<img src= ${movie} alt='img_casourel'></img>`;
                elt_item.appendChild(div);
                let img = document.getElementById(`${name}`);
                img.onclick = function() {
                    myModal.style.display = "block";
                    getMovieData(movie_url);
                }

            }
        });
}

/**
 * function that loads 10 first best romantic movies
 */

function romanticMovies() {
    fetch('http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=romance&page_size=10&page=1')
        .then(res => res.json())
        .then(res => res.results)
        .then(function(value) {
            for (let i = 0; i < value.length; i++) {
                let movie = value[i].image_url;
                let name = value[i].id;
                let movie_url = value[i].url;
                let elt = document.getElementById("carousel_romance");
                let elt_item = document.createElement('div');
                elt_item.setAttribute('class', 'casourel_item');
                elt.appendChild(elt_item);
                let div = document.createElement('div');
                div.setAttribute('id', name);
                div.innerHTML = `<img src= ${movie} alt='casourel'></img>`;
                elt_item.appendChild(div);
                let img = document.getElementById(`${name}`);
                img.onclick = function() {
                    myModal.style.display = "block";
                    getMovieData(movie_url);
                }
            }
        });
}

function categorie1() {
    fetch('http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=&{title_categorie1}&page_size=10&page=1')
        .then(res => res.json())
        .then(res => res.results)
        .then(function(value) {
            for (let i = 0; i < value.length; i++) {
                let movie = value[i].image_url;
                let name = value[i].id;
                let movie_url = value[i].url;
                let elt = document.getElementById("categorie_1");
                let elt_item = document.createElement('div');
                elt_item.setAttribute('class', 'casourel_item');
                elt.appendChild(elt_item);
                let div = document.createElement('div');
                div.setAttribute('id', name);
                div.innerHTML = `<img src= ${movie} alt='carouselmod'></img>`;
                elt_item.appendChild(div);
                let img = document.getElementById(`${name}`);
                img.onclick = function() {
                    myModal.style.display = "block";
                    getMovieData(movie_url);
                }
            }
        });
}
/**
 * function that loads  the 10 first movies of 2000
 */

function twoThousandMovies() {
    fetch('http://localhost:8000/api/v1/titles/?year=2000&sort_by=-imdb_score&page_size=10&page=1')
        .then(res => res.json())
        .then(res => res.results)
        .then(function(value) {
            for (let i = 0; i < value.length; i++) {
                let movie = value[i].image_url;
                let name = value[i].id;
                let movie_url = value[i].url;
                //console.log(movie);
                elt_item = document.createElement('div');
                let elt = document.getElementById("carousel_two_thousand");
                elt_item.setAttribute('class', 'casourel_item');
                elt.appendChild(elt_item);
                let div = document.createElement('div');
                div.setAttribute('id', name);
                div.innerHTML = `<img src= ${movie} alt='casourel'></img>`;
                elt_item.appendChild(div);
                let img = document.getElementById(`${name}`);
                img.onclick = function() {
                    myModal.style.display = "block";
                    getMovieData(movie_url);
                }

            }
        });
}

/**
 * function that loads the 10 first movies with Brad Pitt 
 */

function bradMovies() {
    fetch('http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&actor_contains=Brad+Pitt&&page_size=10&page=1')
        .then(res => res.json())
        .then(res => res.results)
        .then(function(value) {
            for (let i = 0; i < value.length; i++) {
                let movie = value[i].image_url;
                let name = value[i].id;
                let movie_url = value[i].url;
                //console.log(movie);
                elt_item = document.createElement('div');
                let elt = document.getElementById("carousel_brad");
                elt_item.setAttribute('class', 'casourel_item');
                elt.appendChild(elt_item);
                let div = document.createElement('div');
                div.setAttribute('id', name);
                div.innerHTML = `<img src= ${movie} alt='casourel'></img>`;
                elt_item.appendChild(div);
                let img = document.getElementById(`${name}`);
                img.onclick = function() {
                    myModal.style.display = "block";
                    getMovieData(movie_url);
                }
            }
        });
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == myModal) {
        myModal.style.display = "none";
    }
};