export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = {
            id: id,
            title: title,
            author: author,
            img: img
        };
        this.likes.push(like);

        // Persist data in localStorage
        this.persistData();

        return like;
    }

    deleteLike(id) {
        const index = this.likes.findIndex((el) => {
            el.id === id;
        });

        // Persist data in localStorage
        this.persistData();

        this.likes.splice(index, 1);
    }

    isLiked(id) {
        // If recipe is not liked, it will return index of -1
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistData () {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }

    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        // Restoring from local storage
        if (storage) {
            this.likes = storage;
        }
    }
}