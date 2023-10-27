import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import axios from 'axios';

const refs = {
    form: document.querySelector('.search-form'),
    list: document.querySelector('.gallery'),
    guard: document.querySelector('.js-guard'),
}

refs.form.addEventListener('submit', hadlerSearch);
refs.list.classList.add('is-hidden');

const options = {
  root: null,
  rootMargin: "300px",
};

const observer = new IntersectionObserver(handlerLoadMore, options);

let currentPage = 12;
let userPicture = "";

export async function getPictures(userPicture) {
    axios.defaults.baseURL = 'https://pixabay.com/api/';
    const resp = await axios.get('', {
        params: {
            key: '40253142-cb6894ff2fafd8467210783e3',
            q: `${userPicture}`,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
            per_page: 40,
            page: `${currentPage}`,
        }
    });
    const pictures = await resp.data;
    return pictures;
}

function hadlerSearch(e) {
    refs.list.classList.remove('is-hidden');
    e.preventDefault();
    refs.list.innerHTML = '';

    userPicture = refs.form.elements.searchQuery.value;
    currentPage = 12;
    getPictures(userPicture)
        .then((data) => {
            if (data.totalHits === 0) {
                throw new Error(Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')); 
            }
            if (data.hits.length < data.totalHits) {
                observer.observe(refs.guard);
            }
            Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`)
            refs.list.insertAdjacentHTML('beforeend', createMarkup(data));
            galleryBox.refresh();
        })
        .catch(() => {
            console.log('ERROR');
        });
    
    refs.form.reset();
}

function handlerLoadMore(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            currentPage += 1;
            getPictures(userPicture)
                .then((data) => {
                refs.list.insertAdjacentHTML('beforeend', createMarkup(data));
                galleryBox.refresh();
                    if (currentPage >= 13) {
                        observer.unobserve(refs.guard);
                        Notiflix.Notify.warning("We're sorry, but you've reached the end of search results.");
                    }
            })
            .catch(() => {
                console.log('ERROR');
            });
        }
    });
}

function createMarkup(data) {
    return data.hits.map(({largeImageURL, webformatURL, tags, likes, views, comments, downloads}) => `
    <div class="photo-card">
        <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" width="360px" height="241px" /></a>
        <div class="info">
            <p class="info-item">
                <b>Likes</b> ${likes}
            </p>
            <p class="info-item">
                <b>Views</b> ${views}
            </p>
            <p class="info-item">
                <b>Comments</b> ${comments}
            </p>
            <p class="info-item">
                <b>Downloads</b> ${downloads}
            </p>
        </div>
    </div> `).join('');
}

const galleryBox = new SimpleLightbox('.gallery a', {
    captionDelay: 250,
});
