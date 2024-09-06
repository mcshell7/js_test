let url = 'https://jsonplaceholder.typicode.com/users';
const fullPath = window.location.pathname;
const fileName = fullPath.substring(fullPath.lastIndexOf('/') + 1);
let fileNameDetails = 'user-details.html';
let fileNamePost = 'post-details.html';


function createElement(element, className, content, attributes = [{}]) {
    const elem = document.createElement(element);

    if (className) {
        if (Array.isArray(className)) {
            for (let i = 0; i < className.length; i++) {
                elem.classList.add(className[i]);
            }
        } else {
            elem.classList.add(className);
        }
    }

    if (content) {
        elem.textContent = content;
    }

    if (attributes){
        for (let attr of attributes) {
            for (const attrKey in attr) {
                elem.setAttribute(attrKey, attr[attrKey]);
            }
        }
    }


    return elem;
}

if (fileName === 'index.html') {
    async function usersFetch() {
        try {
            const response = await fetch(url);
            const data = await response.json();
            data.forEach(user => displayUsers(user));
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }

    const usersList = createElement('ul', ['user__list', 'text-center'], 0, [{id: 'users'}]);
    let displayUsers = (user) => {

        const card = createElement('li', ['card', 'text-center'], 0);
        const cardBody = createElement('div', 'card-body', 0);
        const name = createElement('p', 'card-text', user.name);
        const id = createElement('h2', 'card-title', user.id);
        const btn = createElement('a', ['btn', 'btn-sm', 'btn-primary'], 'Show more');

        document.body.append(usersList);
        card.append(cardBody);
        cardBody.append(id, name, btn);
        usersList.append(card);

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = fileNameDetails;
            localStorage.setItem('user', JSON.stringify(user));
        });
    }
    usersFetch();
}

if (fileName === 'user-details.html') {
    let displayUsersFull = (storedUser) => {

        let userBlock = createElement('ul', ['info', 'list-group'], 0, [{id: 'user'}]);
        document.body.append(userBlock);

        for (const eKey in storedUser) {
            let item = createElement('li', [`info__${eKey}`, 'list-group-item'], 0);
            userBlock.appendChild(item);
            if (typeof storedUser[eKey] !== 'object') {
                item.textContent = storedUser[eKey];
            } else {
                item.textContent = eKey.charAt(0).toUpperCase() + eKey.slice(1) + ':';
                const subList = createElement('ul', 'sub__list', 0);
                let storedUserSub = storedUser[eKey];

                for (const key in storedUserSub) {
                    let subItem = createElement('li', 'sub__item', storedUser[eKey][key]);
                    if (typeof storedUserSub[key] !== 'object') {
                        subList.appendChild(subItem);
                    } else if (typeof storedUserSub[key] === 'object') {
                        const subList2 = createElement('ul', 'sub__list', 0);
                        for (const subItemKey in storedUserSub[key]) {
                            const subItem1 = createElement('li', 'sub__list1', storedUserSub[key][subItemKey]);
                            subList2.appendChild(subItem1);
                        }
                        subList.appendChild(subList2);
                    }
                }
                item.appendChild(subList);
            }
        }
        const btn = createElement('a', ['post__btn', 'btn', 'btn-sm', 'btn-primary'], 'posts of current user', [{id: 'post__btn'}]);
        const btnContainer = createElement('div', ['posts__btn-container'], 0);

        document.body.append(btnContainer);
        btnContainer.append(btn);
    }

    const getUser = JSON.parse(localStorage.getItem('user'));
    displayUsersFull(getUser);
}
if (fileName === fileNameDetails) {

    function addPostsToStorage(posts) {
        const btn = document.getElementById('post__btn');

        function handleClickAllPosts(e) {
            e.preventDefault();

            // adding all posts to Storage by this user ID
            localStorage.setItem('posts', JSON.stringify(posts));
            const postList = createElement('ul', ['posts'], 0);

            for (const item of posts) {

                const postItem = createElement('li', 'card', 0);
                const postContainer = createElement('li', 'card-body', 0);
                const postTitle = createElement('h4', 'h4', item.title);
                const postBtn = createElement('a', ['full-post', 'btn', 'btn-primary', 'btn-sm'], 'Show more');

                postItem.append(postContainer);
                postContainer.append(postTitle, postBtn);
                postList.appendChild(postItem);

                postBtn.onclick = function () {
                    localStorage.setItem(`post`, JSON.stringify(item));
                    location.href = `post-details.html`;
                }
            }
            // adding list with all posts by user ID
            document.body.append(postList);
            // removing event listener after 1 click
            btn.removeEventListener('click', handleClickAllPosts);
        }
        btn.addEventListener('click', handleClickAllPosts);
    }

    async function fetchPosts(url) {
        await fetch(url)
            .then(value => value.json())
            .then(posts => addPostsToStorage(posts))
    }

    const userId = JSON.parse(localStorage.getItem('user')).id;
    const urlPosts = `https://jsonplaceholder.typicode.com/users/${userId}/posts`;

    fetchPosts(urlPosts);
}


if (fileName === fileNamePost) {

    function getPostsFromStorage() {
        const storedPost = JSON.parse(localStorage.getItem('post'));

        const postContainer = createElement('div', ['post'], 0);
        const id = createElement('div', ['id'], `post ID: ${storedPost.id}`);
        const title = createElement('h1', ['title', 'h1'], storedPost.title);
        const content = createElement('div', ['content'], storedPost.body);

        document.body.append(postContainer);
        postContainer.append(title, content, id);
        return storedPost;
    }

    function showAllComments(comments) {
        const commentsBlock = createElement('div', ['comments'], 0);
        const commentsList = createElement('ul', ['comments__list'], 0);
        const commentsHeading = createElement('h2', 'h2', 'Comments');
        commentsBlock.append(commentsHeading, commentsList);
        document.body.append(commentsBlock);

        for (const key in comments) {
            const comment = createElement('li', ['comment', 'card']);
            const commentContainer = createElement('div', ['comment', 'card-body']);
            const commentContent = createElement('div', ['comment__content'], comments[key].body);
            const commentId = createElement('div', ['comment__id'], `id: ${comments[key].id}`);
            const commentEmail = createElement('a', ['comment__email'], comments[key].email, [{href: `mailto:${comments[key].email}`}]);
            const commentName = createElement('h4', ['comment__name', 'h4'], comments[key].name);
            const commentPostId = createElement('div', ['comment__post-id'], `Post ID: ${comments[key].postId}`);

            commentsList.append(comment);
            comment.append(commentContainer);
            commentContainer.append(commentName, commentContent, commentId, commentPostId, commentEmail);
        }
    }

    async function fetchComments(postId) {
        let urlComments = `https://jsonplaceholder.typicode.com/posts/${postId}/comments`;

        await fetch(urlComments)
            .then(response => response.json())
            .then(response => {
                showAllComments(response);
            })
    }
    let postId = getPostsFromStorage().id;
    fetchComments(postId);
}