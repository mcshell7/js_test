let url = 'https://jsonplaceholder.typicode.com/users';
const fullPath = window.location.pathname;
const fileName = fullPath.substring(fullPath.lastIndexOf('/') + 1);
let fileNameDetails = 'user-details.html';
let fileNamePost = 'post-details.html';


let usersList = document.getElementById('users');

function createElement(element, className, content) {
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
    return elem;
}


async function usersFetch() {
    let response = await fetch(url).then(value => value.json());
    for (let i = 0; i < response.length; i++) {
        displayUsers(response[i]);
    }
}

let displayUsers = (user) => {
    const card = createElement('li', ['card', 'text-center']);
    const cardBody = createElement('div', 'card-body');

    const name = createElement('p', 'card-text', user.name);
    const id = createElement('h2', 'card-title', user.id);
    const btn = createElement('a', ['btn', 'btn-sm', 'btn-primary'], 'Show more');


    btn.href = fileNameDetails;

    card.appendChild(cardBody);
    cardBody.appendChild(id);
    cardBody.appendChild(name);
    cardBody.appendChild(btn);
    if (usersList) {
        usersList.appendChild(card);
    }
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = fileNameDetails;
        localStorage.setItem('user', JSON.stringify(user));
    });
}
if (fileName === 'index.html') {
    usersFetch();
}
if (fileName === 'user-details.html') {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    let displayUsersFull = () => {
        let userBlock = document.getElementById('user');
        for (const eKey in storedUser) {
            let item = createElement('li', [`info__${eKey}`, 'list-group-item']);
            userBlock.appendChild(item);
            if (typeof storedUser[eKey] !== 'object') {
                item.textContent = storedUser[eKey];
            } else {
                item.textContent = eKey.charAt(0).toUpperCase() + eKey.slice(1) + ':';
                let subList = createElement('ul', 'sub__list');
                let storedUserSub = storedUser[eKey];
                for (const key in storedUserSub) {
                    let subItem = createElement('li', 'sub__item', storedUser[eKey][key]);
                    if (typeof storedUserSub[key] !== 'object') {
                        subList.appendChild(subItem);
                    } else if (typeof storedUserSub[key] === 'object') {
                        let subList2 = createElement('ul', 'sub__list');
                        let subItem1 = createElement('li', 'sub__list1', storedUserSub[key].lat);
                        let subItem2 = createElement('li', 'sub__list1', storedUserSub[key].lng);
                        subList2.appendChild(subItem1);
                        subList2.appendChild(subItem2);
                        subList.appendChild(subList2);
                    }
                }
                item.appendChild(subList);
            }
        }
        let btn = createElement('a', ['post__btn', 'btn', 'btn-sm', 'btn-primary']);
        let btnContainer = createElement('div', ['posts__btn-container']);
        btn.textContent = 'posts of current user';
        btn.setAttribute("id", "post__btn");
        document.body.append(btnContainer);
        btnContainer.append(btn);
    }
    displayUsersFull();
}
if (fileName === fileNameDetails) {
    let userId = JSON.parse(localStorage.getItem('user')).id;
    let urlPosts = `https://jsonplaceholder.typicode.com/users/${userId}/posts`;

    async function fetchPosts() {
        await fetch(urlPosts)
            .then(value => value.json())
            .then(posts => addPostsToStorage(posts));
    }

    function addPostsToStorage(posts) {
        let btn = document.getElementById('post__btn');

        function handleClickAllPosts(e) {
            e.preventDefault();

            // adding all posts to Storage by this user ID
            localStorage.setItem('posts', JSON.stringify(posts));
            const postList = createElement('ul', ['posts']);

            for (const item of posts) {

                const postItem = createElement('li', 'card');
                const postContainer = createElement('li', 'card-body');
                const postTitle = createElement('h4', 'h4');
                const postBtn = createElement('a', ['full-post', 'btn', 'btn-primary', 'btn-sm']);

                postTitle.textContent = item.title;
                postBtn.textContent = 'Show more';

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


    fetchPosts();
}

function getPostsFromStorage() {
    const storedPost = JSON.parse(localStorage.getItem('post'));
    console.log(storedPost);
    let postContainer = createElement('div', ['post']);
    document.body.append(postContainer);

    let id = createElement('div', ['id']);
    let title = createElement('h1', ['title', 'h1']);
    let content = createElement('div', ['content']);
    id.textContent = 'post ID: ' + storedPost.id;
    title.textContent = storedPost.title;
    content.textContent = storedPost.body;

    postContainer.append(title, content, id);
    return storedPost;
}

if (fileName === fileNamePost) {
    let postId = getPostsFromStorage().id;
    let urlComments = `https://jsonplaceholder.typicode.com/posts/${postId}/comments`;
    function showAllComments(comments) {
        let commentsBlock = createElement('div', ['comments']);
        let commentsList = createElement('div', ['comments__list']);
        let commentsHeading = createElement('h2', 'h2','Comments');
        commentsBlock.append(commentsHeading, commentsList);
        document.body.append(commentsBlock);
        console.log(comments);

        for (const key in comments) {
            let comment = createElement('div', ['comment', 'card']);
            let commentContainer = createElement('div', ['comment', 'card-body']);
            let commentContent = createElement('div', ['comment__content'], comments[key].body);
            let commentId = createElement('div', ['comment__id'],`id: ${comments[key].id}`);
            let commentEmail = createElement('a', ['comment__email'],comments[key].email);
            commentEmail.href = `mailto:${comments[key].email}`;
            let commentName = createElement('h4', ['comment__name', 'h4'],comments[key].name);
            let commentPostId = createElement('div', ['comment__post-id'],`Post ID: ${comments[key].postId}`);
            commentsList.append(comment);
            comment.append(commentContainer);
            commentContainer.append(commentName,commentContent,commentId,commentPostId,commentEmail);

        }
    }

    async function fetchComments() {
        let response = await fetch(urlComments)
            .then(value => value.json())
            .then(comments => showAllComments(comments));
    }
    fetchComments();

}


