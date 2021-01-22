var bookArchive = [];
var currentShelf = "finished";

localStorage = window.localStorage;
readLocalStorage();

function readLocalStorage() {
    bookArchive = (JSON.parse(localStorage.getItem('bookArchive')));
}

async function searchTitle() {
    if (document.getElementById("site-search").value != "") {

        document.getElementById("book-interface")
        .innerHTML = `<div id="question-box"><h2>Searching...</h2></div>`

        const url = generateUrl();
        const response = await fetchData(url);
        const booksFound = await processFetch(response)

        updateQuestion(booksFound);
    }

    function generateUrl() {
        const searchInput = getInput();
        clearInput();
        const url = prepareUrl();
      
        return url;
      
        function prepareUrl() {
          return `http://openlibrary.org/search.json?title=${searchInput}`
        }
        function getInput() {
          return document.getElementById("site-search").value.replace(/ /g, '+')
        }
        function clearInput() {
          document.getElementById("site-search").value = ""
        }
      }

    function fetchData(url) {
        return new Promise((resolve) => {
            console.log(`Making Request to ${url}`)
            resolve(
                    fetch(url)
                        .then(result => result.json())
                        .then(data => 
                        {
                            booksFound = [];
                            for (let book in data.docs) {
                                if ( data.docs[book].has_fulltext === true ) {
                                booksFound.push(data.docs[book])
                                }
                            }
                            return booksFound
                        })
            )
        })
    }
    function processFetch(response) {
        return new Promise((resolve) => {
            resolve(response)
        })
    }

    function updateQuestion(booksFound) {
        try {
            firstEntry = booksFound[0];
            const myBook = parsingBookData(firstEntry);
            var titleUrl = `https://openlibrary.org/${myBook.titleKey}`;
            var authorUrl = 
            `https://openlibrary.org/authors/${myBook.authorKeys}`;

            document.getElementById("question-box").innerHTML =
            `<h2>Did you mean 
                <a href="${titleUrl}" target="_blank">${myBook.title}</a></br>
                by
                <a href="${authorUrl}" target="_blank">${myBook.authors}</a>?
            </h2>
            <div id="answer-buttons">
                <button id="yes-button">Yes</button>
                <button id="no-button">No</button>
            <div>`;

            var yesButton = document.getElementById("yes-button");
            yesButton.onclick = function () {
                showBookInterface(myBook)
            }

            } catch (err) {
            document.getElementById("question-box").innerHTML =
                `<h2>No matches found. Please try another search.</h2>`
            }
    }
    function parsingBookData(firstEntry) {
        title = firstEntry["title"]
        titleKey = firstEntry["key"]
        authors = firstEntry["author_name"]
        authorKeys = firstEntry["author_key"]
        coverId = firstEntry["cover_i"]
        publishYears = firstEntry["publish_year"]

        var myBook = { title: title, titleKey: titleKey, authors: authors,
                       authorKeys: authorKeys, coverId: coverId,
                       publishYears: publishYears }

        return myBook;
    }
}

function showBookInterface(book) {
    document.getElementById("book-interface").innerHTML =
    `<div id="myBook-interface">
        <div id="cover-image-container">
            <img id="cover-image" src="http://covers.openlibrary.org/b/id/${book.coverId}-M.jpg">
        </div>
        <div id="right-container">
            <div id="title-container">
                <h2>
                    <p><span id="book-title"><a href="https://openlibrary.org/${book.titleKey} target="_blank">${book.title}</a></span></p>
                    <p>By <a href="https://openlibrary.org/authors/${book.authorKey}" target="_blank">${book.authors}</a></p>
                </h2>
            </div>
            <div id="option-buttons">
                <button id="add-finished">Add to Finished</button>
                <button id="add-reading">Add to Reading</button>
                <button id="add-wishlist">Add to Wishlist</button>
                <button id="add-favorite">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0
                    00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>
        </div>
    </div>`

    var addButton = document.getElementById("add-finished");
    addButton.onclick = function () {
        book.shelf = "finished";
        addBook(book);
    }
    var addButton = document.getElementById("add-reading");
    addButton.onclick = function () {
        book.shelf = "reading";
        addBook(book);
    }
    var addButton = document.getElementById("add-wishlist");
    addButton.onclick = function () {
        book.shelf = "wishlist";
        addBook(book);
    }
    function addBook(book) {
        if (bookArchive.filter(el => el.titleKey === book.titleKey && el.shelf === book.shelf).length === 0) {
            bookArchive.push(book);
        } else {
            bookArchive.map((book) => {
                book.shelf = book.shelf;
            })
        }
        updateCounter();
        generateShelf();
    }
}

function updateCounter() {
    document.getElementById("collection-counter").innerHTML = bookArchive.length;
}
function generateShelf() {
    clearShelf();
    populateShelf();
    localStorage.setItem('bookArchive', JSON.stringify(bookArchive));

    function clearShelf() {
        document.getElementById("books-container").innerHTML = ``;
    }

    function populateShelf() {
        for ( let book in bookArchive ) {
            myBook = bookArchive[book];
            if ( myBook.shelf == currentShelf ) {
                document.getElementById("books-container").innerHTML +=
                `<div id="myBook">
                <div id="image-wrap">
                    <button id="shelf-delete-button" onclick="deleteBook('${myBook.titleKey}')">x</button>
                    <img onclick="fetchBook('${myBook.titleKey}')" title="${myBook.title} by ${myBook.authors}"
                    src="http://covers.openlibrary.org/b/id/${myBook.coverId}-M.jpg">
                </div>
                <div id="myBook-title-container">
                    <p id="myBook-title">${myBook.title}</p>
                </div>
                <p id="myBook-author">${myBook.authors}</p>
                </div>`
            }
        }
    }
}
function fetchBook(titleKey) {
    var book = bookArchive.filter(el => el.titleKey == titleKey)
    showBookInterface(book[0]);
}

function changeShelf(shelf) {
    currentShelf = shelf;
    var shelves = document.getElementsByClassName("shelf-button");
    for ( var i = 0; i < shelves.length; i++ ) {
        shelves[i].style.color = 'gray';
    }
    document.getElementById(shelf+'-shelf').style.color='#4f4b8f';
    generateShelf();
}
function deleteBook(titleKey) {
    bookArchive = bookArchive.filter( el => el.titleKey != titleKey )
    updateCounter();
    generateShelf();
}

// Favorites
// View all

window.onload = function enterSearch() {
    generateShelf();
    document.getElementById("finished-shelf").style.color='#4f4b8f';
    document.getElementById("reading-shelf").style.color='gray';
    document.getElementById("wishlist-shelf").style.color='gray';
    const node = document.getElementById("site-search");
    node.addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
        searchTitle();
      }
    })
    };

/// a promised land sorting
// scroll on shelf