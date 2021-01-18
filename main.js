var bookArchive = [];

// Fetch data on site search

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
            myBook = parsingBookData(firstEntry);
            var titleUrl = `https://openlibrary.org/${myBook.titleKey}`;
            var authorUrl = 
            `https://openlibrary.org/authors/${myBook.authorKeys}`;

            document.getElementById("question-box").innerHTML =
            `<h2>Did you mean 
                <a href="${titleUrl}" target="_blank">${myBook.title}</a>
                by
                <a href="${authorUrl}" target="_blank">${myBook.authors}</a>?
            </h2>
            <div id="answer-buttons">
                <button id="yes-button">Yes</button>
                <button id="no-button">No</button>
            <div>`;
          //  document.getElementById("answer-buttons").style.visibility = "visible";
            } catch (err) {
            document.getElementById("question-box").innerHTML =
                //`<h2>No matches found. Please try another search.</h2>`
                `${err}`
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

// Returning data in question
// Yes/No
// Show book interface
// Add to book archive
// Generate tables
// Switch between tables
// Favorites
// View all
// Local storage

window.onload = function enterSearch() {
    const node = document.getElementById("site-search");
    node.addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
        searchTitle();
      }
    })
  };