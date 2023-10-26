import axios from 'axios';

export async function getPictures(userPicture) {
    axios.defaults.baseURL = 'https://pixabay.com/api/';
    const resp = await axios.get('', {
        params: {
            key: '40253142-cb6894ff2fafd8467210783e3',
            q: `${userPicture}`,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true
        }
    });
    const pictures = resp.data;
    return pictures;
}