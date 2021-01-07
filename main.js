var bookArchive = [];
var id = 1;
function fetchData(url) {
  return new Promise((resolve, reject) => {
    console.log(`Making Request to ${url}`)
    resolve(
      fetch(url)
        .then(result => result.json())
        .then(data => {
          for (let book in data.docs) {
            return data.docs[book]
          }
        })
    )
  })
}
function processFetch(response) {
  return new Promise((resolve, reject) => {
    resolve(response)
  })
}
function updateQuestion(book_info) {
  try {
    parsingBookData();
    document.getElementById("question").innerHTML =
      `<h2>Did you mean <span id="title-span"><a href="https://openlibrary.org/${titleKey}" target="_blank">${title}</a></span>
     by <span id="author-span"><a href="https://openlibrary.org/authors/${authorKey}" target="_blank">${author}</a></span>?</h2></br>`;
    document.getElementById("answer-buttons").style.visibility = "visible";
  } catch (err) {
    document.getElementById("question").innerHTML =
      `<h2>No matches found. Please try another search.</h2>`
  }

  function parsingBookData() {
    title = book_info.title
    titleKey = book_info.key
    author = book_info.author_name[0]
    authorKey = book_info.author_key
    cover_id = book_info.cover_i
    year = book_info.publish_year
  }
}
var globalUrl = "";
async function searchTitle() {
  if (document.getElementById("site-search").value != "") {
    const url = generateUrl();
    globalUrl = url;
    document.getElementById("question").innerHTML = `<h2>Searching...</h2>`
    document.getElementById("book-interface").innerHTML = ""
    const response = await fetchData(url);
    const book_info = await processFetch(response)
    updateQuestion(book_info);
  }
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
function clickYes() {
  document.getElementById("book-interface").style.visibility = "visible";
  document.getElementById("book-interface").innerHTML =
    `<div id="cover-image-container">
    <img id="cover-image" src="http://covers.openlibrary.org/b/id/${cover_id}-M.jpg">
  </div>
  <div id="options-container">
  <h2><span id="title-span"><a href="https://openlibrary.org/${titleKey}" target="_blank">${title}</a></span> 
  by <span id="author-span"><a href="https://openlibrary.org/authors/${authorKey}" target="_blank">${author}</a></span></h2></br>
  <div id="options">
  <p>Add to Finished <button id="add-to" onclick="addBook('${title}', '${author}', '${year}', '${cover_id}', 'finished', 'false')">-></button></p>
  <p>Add to Currently Reading <button id="add-to" onclick="addBook('${title}', '${author}', '${year}', '${cover_id}', 'reading', 'false')">-></button></p>
  <p>Add to Wishlist <button id="add-to" onclick="addBook('${title}', '${author}', '${year}', '${cover_id}', 'wishlist', 'false')">-></button></p>
  <p>Save to Favorites <button id="favorites-button" onclick="addBook('${title}', '${author}', '${year}', '${cover_id}', 'finished',` + true + `)"><3</button></p>
  <p>Show title in openlibrary.org <button><a href="https://openlibrary.org/${titleKey}" target="_blank">-></a></button></p>
  <p>Show author in openlibrary.org <button><a href="https://openlibrary.org/authors/${authorKey}" target="_blank">-></a></button></p></div></dib>`
  document.getElementById("answer-buttons").style.visibility = "hidden";
  document.getElementById("question").innerHTML = "";
}
var booksFound = [];
function fetchFullData(url) {
  return new Promise((resolve, reject) => {
    console.log(`Making Request to ${url}`)
    resolve(
      fetch(url)
        .then(result => result.json())
        .then(data => {
          for (let book in data.docs) {
            booksFound.push(data.docs[book])
          }
        })
    )
  })
}
async function clickNo() {
  booksFound = [];
  document.getElementById("answer-buttons").style.visibility = "hidden";
  document.getElementById("question").innerHTML = "";
  document.getElementById("book-interface").style.visibility = "visible";
  document.getElementById("book-interface").innerHTML = 
  `Other similar titles:
  <table>
    <tr>
      <th>Title</th>
      <th>Author</th>
    </tr>
  </table>`
  const response = await fetchFullData(globalUrl);
  showSimilarTitles();

  function showSimilarTitles() {
    var filteredTitles = booksFound.filter( book => book.has_fulltext == true )
    var similarTitles = filteredTitles.slice(1, 11)
  }
}
function addBook(title, author, year, cover_id, table, favorite) {
  const book = { id: id, title: title, author: author, year: year, cover: cover_id, table: table, favorite: favorite }
  if (bookArchive.filter(el => el.title === book.title && el.table === book.table).length === 0) {
    bookArchive.push(book);
    id += 1;
  }
  generateTables();
}
function generateTables() {
  clearTables();
  populateTables();
  clearFavorites();
  updateFavorites();

  function populateTables() {
    for (let book in bookArchive) {
      const myBook = bookArchive[book];
      const table = bookArchive[book].table;
      const bookId = bookArchive[book].id;
      document.getElementById(table + "-table").innerHTML +=
        `<tr>
          <td>${myBook.title}</td>
          <td>${myBook.author}</td> 
          <td><button id="favorite-button" onclick="addToFavorites(${bookId})"><3</button>
              <button id="move-button" onclick="moveBook(${bookId}, 'finished')">V</button>
              <button id="move-button" onclick="moveBook(${bookId}, 'reading')">-></button>
              <button id="move-button" onclick="moveBook(${bookId}, 'wishlist')">*</button>
              <button id="delete-button" onclick="deleteBook(${bookId})">x</button></td> 
        </tr>`;
    }
  }
  function clearTables() {
    document.getElementById("finished-table").innerHTML =
      `<tr>
    <th>Title</th>
    <th>Author</th>
    <th>...</th>
  </tr>`;
    document.getElementById("reading-table").innerHTML =
      `<tr>
    <th>Title</th>
    <th>Author</th>
    <th>...</th>
  </tr>`;
    document.getElementById("wishlist-table").innerHTML =
      `<tr>
    <th>Title</th>
    <th>Author</th>
    <th>...</th>
  </tr>`;
  }
}
function deleteBook(id) {
  bookArchive = bookArchive.filter(book => book.id != id)
  generateTables();
};
function moveBook(id, table) {
  bookArchive.map((book) => {
    if (book.id = id) {
      book.table = table;
    }
  })
  generateTables();
}
function addToFavorites(id) {
  bookArchive.map((book) => {
    if (book.id = id) {
      book.favorite = true;
    }
  })
  clearFavorites();
  updateFavorites();
}
function clearFavorites() {
  document.getElementById("favorites").innerHTML = ``;
}
function updateFavorites() {
  for (let book in bookArchive) {
    if (bookArchive[book].favorite === true) {
      const coverId = bookArchive[book].cover;
      const bookCover = getCover(coverId);
      document.getElementById("favorites").innerHTML += bookCover;
    }
  }

  function getCover(coverId) {
    return `<div id="favorite-${coverId}"><img id="cover-image" src="http://covers.openlibrary.org/b/id/${coverId}-S.jpg"></img></div>`
  }
}
window.onload = function enterSearch() {
  const node = document.getElementById("site-search");
  node.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      searchTitle();
    }
  })
};