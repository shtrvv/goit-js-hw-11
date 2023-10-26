import Notiflix from 'notiflix';
import { getPictures } from './pictures';

const refs = {
    form: document.querySelector('.search-form'),
    list: document.querySelector('.gallery'),
}

refs.form.addEventListener('submit', hadlerSearch);

function hadlerSearch(e) {
    e.preventDefault();
    refs.list.innerHTML = '';

    const userPicture = refs.form.elements.searchQuery.value;
    getPictures(userPicture)
        .then((data) => {
            if (data.totalHits === 0) {
                throw new Error(Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.')); 
            }
            Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`)
            refs.list.insertAdjacentHTML('afterbegin', createMarkup(data));
        })
        .catch(() => {
            console.log('ERROR');
        });
    
    refs.form.reset();
}

function createMarkup(data) {
    return data.hits.map(({webformatURL, tags, likes, views, comments, downloads}) => `
    <div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" width="360px" height="241px" />
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