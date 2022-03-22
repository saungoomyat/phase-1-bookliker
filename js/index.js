const booksURL = "http://localhost:3000/books"
bookList = document.getElementById("list");
showPanel = document.getElementById("show-panel");
const self = {
    "id": 1,
    "username": "pouros"
};

document.addEventListener("DOMContentLoaded", function () {

    renderBooks();
});

function renderBooks() {
    fetch(booksURL)
        .then(response => response.json())
        .then(books => {
            books.forEach(book => {
                bookLi = document.createElement("li");
                bookLi.innerText = book.title;
                bookList.append(bookLi);
                bookLi.addEventListener("click", (e) => {
                    renderBookPage(book)
                })
            })
        });
}

function renderBookPage(book) {
    showPanel.innerHTML = "";
    const bookInfo = document.createElement("div");
    bookInfo.innerHTML = `<img src="${book["img_url"]}">
                            <h2 id="title">title</h2>
                            <h2 id="author">${book["author"]}</h2>
                            <p id="description">${book["description"]}</p>
                            <p>liked by:</p>
                            <ul id="users"></ul>`;
    if (book.subtitle) {
        bookInfo.querySelector("#title").innerHTML = `${book["title"]}: ${book["subtitle"]}`;
    }
    else {
        bookInfo.querySelector("#title").innerHTML = book.title;
    };
    const userList = bookInfo.querySelector("#users");
    book.users.forEach(user => {
        const userInfo = document.createElement("li");
        userInfo.innerText = user.username;
        userList.append(userInfo);
    });
    showPanel.append(bookInfo);
    const likeButton = document.createElement("button");
    if (book.users.includes(self)) {
        likeButton.innerText = "Unlike";
    }
    else {
        likeButton.innerText = "Like";
    };
    showPanel.append(likeButton);
    likeButton.addEventListener("click", (e) => {
        likeBook(book);
    })
}

function likeBook(book) {
    if (book.users.includes(self)) {
        book.users = book.users.filter(user => (user != self));
        setUsers(book);
    }
    else {
        book.users.push(self)
        setUsers(book);
    };
    renderBookPage(book);
}

function setUsers(book) {
    fetch(`${booksURL}/${book["id"]}`, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "users": book.users })
    })
} 