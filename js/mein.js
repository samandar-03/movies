let KINOLAR = movies.slice(0, 80);
const elForm = document.querySelector('.form-js');
const elList = document.querySelector('.List');
const elEelect = document.querySelector('.select')
const elSorch = document.querySelector('.sorch-js')
const elSortSelect = document.querySelector('.select-js')
const elPrevent = document.querySelector('.prev_btn')
const elNextBtn = document.querySelector('.next_btn')
const elPageItem = document.querySelector('.link')
const elBoocmark = document.getElementById('boocmark-js').content;
const elBoocmarkTitle = document.querySelector('.Boocmark_title')
const elBoocmarkList = document.querySelector('.boocmark_list')
const elRemove = document.querySelector('.Remove')
const elTitle = document.querySelector('.modal_title')
const eltext = document.querySelector('.modal_text')
const elImg = document.querySelector('.img_modal')

const elWrapper =  document.createDocumentFragment()

const elCardTemplate = document.getElementById('cardTemplate').content;
const sortFunction = {
    az: (a, b) => {
        if (a.title.toLowerCase() < b.title.toLowerCase()) {
            return -1
        } else {
            return 1
        }
    },
    za: (a, b) => {
        if (a.title.toLowerCase() < b.title.toLowerCase()) {
            return 1
        } else {
            return -1
        }
    },
    hl: (a, b) => {
        if (a.imdbRating < b.imdbRating) {
            return 1
        } else {
            return -1
        }
    },
    lh: (a, b) => {
        if (a.imdbRating < b.imdbRating) {
            return -1
        } else {
            return 1
        }
    },
    no: (a, b) => {
        if (a.year < b.year) {
            return -1
        } else {
            return 1
        }
    },
    on: (a, b) => {
        if (a.year < b.year) {
            return 1
        } else {
            return -1
        }
    }
}

let limt = 8;
let page = 1;
let maxPageCount = Math.ceil(KINOLAR.length / limt);

let bookmarks =  localStorage.getItem('bookmarks') ? JSON.parse(localStorage.getItem('bookmarks')) : [] ;


let getMovieGanres = (kinolar) => {
    let categories = [];
    kinolar.forEach((kino) => {
        kino.categories.forEach(category => {
            if (!categories.includes(category)) {
                categories.push(category);
            }
        });
    })
    return categories;
}
let renderCategories = () => {
    let allCategories = getMovieGanres(KINOLAR)
    allCategories.forEach((category) => {
        let categoryOption = document.createElement('option')
        categoryOption.textContent = category;
        categoryOption.value = category;
        elEelect.appendChild(categoryOption)
    })
}
renderCategories()


let renderMovies = (arr) => {
    elList.innerHTML = null
    arr.forEach((movie) => {

        const elCard = elCardTemplate.cloneNode(true);
    
        let title = elCard.querySelector('.card-title');
        let text = elCard.querySelector('.card-text');
        let img = elCard.querySelector('.card-img-top');
        let num = elCard.querySelector('.num');
        let Boocmark = elCard.querySelector('.js-booc');
        let modal = elCard.querySelector('.js-modal')
    
        img.src = movie.smallPoster;
        Boocmark.dataset.id = movie.imdbId;
        modal.dataset.id = movie.imdbId;
        num.textContent = movie.imdbRating;
        text.textContent = movie.summary;
        title.textContent = movie.title;
    
        elList.appendChild(elWrapper);
        elWrapper.appendChild(elCard);
    });
}



let hendelFilter = (evt) => {
    evt.preventDefault();
    let filteredMovies = []

    let categegoriy = elEelect.value;
    let elSorchValue = elSorch.value.trim();
    let sort = elSortSelect.value;
    let regex = new RegExp(elSorchValue, 'gi')

    if (categegoriy === 'all') {
        filteredMovies = KINOLAR;
    } else{
        filteredMovies = KINOLAR.filter((movie) => 
            movie.categories.includes(elEelect.value)
        )
    };
    filteredMovies = filteredMovies.filter((movie) => movie.title.match(regex));
    filteredMovies.sort(sortFunction[sort]);
    renderMovies(filteredMovies);
}

elPageItem.textContent = page;
let handleNextPage = () => {
    page += 1;
    if (page <= maxPageCount) { 
        elPageItem.textContent = page;
        renderMovies(KINOLAR.slice(limt * (page - 1), page * limt));
    };
    if (page === maxPageCount) {
        elNextBtn.disabled = true;
    } else {
        elPrevent.disabled = false;
        elNextBtn.disabled = false;
    }
};

elPrevent.disabled = true;
let handlePrevPage = () => {
    page -= 1
    if (page > 0) {
        elPageItem.textContent = page;
        renderMovies(KINOLAR.slice(limt * (page - 1), page * limt));
    };
    if (page === 1 ) {
        elNextBtn.disabled = false;
        elPrevent.disabled = true;
    }
}
let boocmarkWrapper = document.createDocumentFragment()

let renderBoocmarks = (arr) => {
    arr.forEach(Boocmark => {
        let BoocmarkClone = elBoocmark.cloneNode(true)
        let title = BoocmarkClone.querySelector('.Boocmark_title')
        title.textContent = Boocmark.title;
        boocmarkWrapper.appendChild(BoocmarkClone);
    });
    elBoocmarkList.innerHTML = null
    elBoocmarkList.appendChild(boocmarkWrapper)
};

let hendelListEvend = (evt) => {

    if (evt.target.matches('.js-booc')) {

        let FoundMovie = KINOLAR.find((movie) => movie.imdbId === evt.target.dataset.id)

        let boocmarksMovie = bookmarks.find(Boocmark => Boocmark.imdbId === evt.target.dataset.id);
        console.log(boocmarksMovie)
        if (!boocmarksMovie) {  
            bookmarks.push(FoundMovie)
        }

        localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
        
        renderBoocmarks(bookmarks);
    } else if (evt.target.matches('.js-modal')){
    const foundMovie = KINOLAR.find((movie) => movie.imdbId ===evt.target.dataset.id)
    elImg.src = foundMovie.smallPoster;
    eltext.textContent = foundMovie.summary;
    elTitle.textContent =  foundMovie.title;
    }
}


elList.addEventListener('click', hendelListEvend)
elNextBtn.addEventListener('click', handleNextPage)
elPrevent.addEventListener('click', handlePrevPage)


elForm.addEventListener('submit', hendelFilter);
renderMovies(KINOLAR.slice(0, 9))
renderBoocmarks(bookmarks);