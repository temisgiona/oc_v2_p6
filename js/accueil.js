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
        this.carroussel = element;
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
     * Move the carroussel to the index number
     * @param {number} index 
     */
    gotoItem(index) {
        console.log(index)
        if (index <= -this.carroussel.children.length || index == 1) {
            index = 0;
        }
        let translateX = index * 100 / (this.carroussel.children.length);
        this.carroussel.style.transform = 'translate3d(' + translateX + '%,0,0)';
        this.currentSlide = index;
    }
}

/** class for getting data to bring in the caroussel */
class carousel_data {
    constructor(carouselName,genderName) {
        this.carouselName = carouselName;
        this.genderName = genderName;
        this.getData();
    }
    getData() {
        let carousel_nametest = this.carouselName;
        let gender_name_test = this.genderName;
        let fetch_word = `http://localhost:8000/api/v1/titles/?sort_by=-imdb_score&genre=${gender_name_test}&page_size=10&page=1`
        fetch(fetch_word)
        .then(res => res.json())
        .then(res => res.results)
        .then(function(value) {
            for (let i = 0; i < value.length; i++) {
                let movie = value[i].image_url;
                let name = value[i].id;
                let movie_url = value[i].url;
                let elt = document.getElementById(carousel_nametest);
                let elt_item = document.createElement('div');
                elt_item.setAttribute('class', 'carroussel_item');
                elt.appendChild(elt_item);
                let div = document.createElement('div');
                div.setAttribute('id', name);
                div.innerHTML = `<img src= ${movie} alt='caroussel'></img>`;
                elt_item.appendChild(div);
                let img = document.getElementById(`${name}`);
                img.onclick = function() {
                    myModal.style.display = "block";
                    getMovieData(movie_url);
                }
                
            }
            
        });

    }
}
/**
 * When DOM loaded 
 */
 let title_categorie_1 =["Action","Action"];
 let title_categorie_2 =["Adult","Adultes"];
 let title_categorie_3 =["Adventure","Aventure"];
 let title_categorie_4 =["Animation","Animation"];
 let title_categorie_5 =["Biography","Biographie"];

window.addEventListener("DOMContentLoaded", (event) => {
    /** Fetch data for each caroussel */
    bestMovieRecorded();
    /** choose de category to display, 
     * firt data = html section
     * second data = category choosen
     *  */
    const cat1 = new carousel_data("carousel_cat1", title_categorie_1[0]);
    const cat2 = new carousel_data("carousel_cat2", title_categorie_4[0]);
    const cat3 = new carousel_data("carousel_cat3", title_categorie_5[0]);

    //console.log("DOM ok");
    /** Instances each carrousel */
    document.getElementById("title0").textContent  = "Films: le top du classement";
    new Carousel(document.getElementById("categorie_best_movies"), document.querySelector("#carousel_best_movies"), {
        slidesToScroll: 2
    });
    // first category
    document.getElementById("title1").textContent  = title_categorie_1[1];
    new Carousel(document.getElementById("categorie1"), document.querySelector("#carousel_cat1"), {
        slidesToScroll: 2
    });
    // second category
    document.getElementById("title2").textContent  = title_categorie_4[1];
    new Carousel(document.getElementById("categorie2"), document.querySelector("#carousel_cat2"), {
        slidesToScroll: 2
    });
    // three category
    document.getElementById("title3").textContent  = title_categorie_5[1];
    new Carousel(document.getElementById("categorie3"), document.querySelector("#carousel_cat3"), {
        slidesToScroll: 2
    });
    // modal window
    var myModal = document.querySelector("#myModal");
    var span = document.getElementsByClassName("close")[0];
    span.onclick = function() {
        myModal.style.display = "none";
    }

});



/**
 * function that load particle data of a entry
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
                    <div id="movie_details">
                    <div><img src= ${movie_url} alt='movie'></img></div>
                    <div id="divers_details">
                        <H2>${movie_title}</H2>
                        <p> <B>Durée :</B>${movie_duration}</p>
                        <p> <B>Genre : </B> ${movie_type} </p>
                        <p> <B>Date de sortie : </B>${movie_release_date}</p>
                        <p> <B>Moyenne des votes :</B> ${movie_rated} </p>
                        <p> <B>Score Imbd :</B> ${movie_imbd}</p>
                        <p> <B>Réalisateur :</B>${movie_directors}</p>
                        <p> <B>Pays d'origine : </B> ${movie_countries} </p>
                        <p> <B>Casting :</B> ${movie_actors}</p>
                        <p> <B>Résultat box office : </B> ${movie_votes} </p>
                        <p> <B>Résumé :</B> ${movie_des} </p>
                        </div>
                    </div>`
        });
}

/**
 * 
 * function that load the rangeof best movies by imbd ranking
 */

function bestMovieRecorded() {
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
                        .getElementById("video_centrale")
                        .innerHTML = `
                <div><img src= ${bestMovie_url} alt='video centrale'></img></div>`;
                });
                fetch(bestMovie_url_des)
                .then((res) => res.json())
                .then((res) => {
                    bestMovie_des = res.description;
                    document
                        .getElementById("intro")
                        .innerHTML = `
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

// When the user clicks anywhere outside of the modal, close it
// on sort du  mode , si on clic en dehors.
window.onclick = function(event) {
    if (event.target == myModal) {
        myModal.style.display = "none";
    }
}