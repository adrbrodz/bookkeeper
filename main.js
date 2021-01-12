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
    parsingBookData(book_info);
    document.getElementById("question").innerHTML =
      `<h2>Did you mean <span id="title-span"><a href="https://openlibrary.org/${titleKey}" target="_blank">${title}</a></span>
     by <span id="author-span"><a href="https://openlibrary.org/authors/${authorKey}" target="_blank">${author}</a></span>?</h2></br>`;
    document.getElementById("answer-buttons").style.visibility = "visible";
  } catch (err) {
    document.getElementById("question").innerHTML =
      `<h2>No matches found. Please try another search.</h2>`
  }
}
function parsingBookData(book_info) {
  title = book_info.title
  titleKey = book_info.key
  author = book_info.author_name[0]
  authorKey = book_info.author_key[0]
  cover_id = book_info.cover_i
  year = book_info.publish_year[0]
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
  `<div id="similar-titles-container">
    <h2> Searching for similar titles... </h2>
   </div>`
  const response = await fetchFullData(globalUrl);
  document.getElementById("book-interface").innerHTML = 
  `<div id="similar-titles-container">
    <h2>Similar titles:</h2>
    <table id="similar-titles">
        <tr>
            <th>Title</th>
            <th>Author</th>
            <th>...</th>
        </tr>
    </table>
   </div>`
  let similarTitles = [];
  similarTitles = showSimilarTitles();
  for ( let book in similarTitles ) {
    bookId = id;
    parsingBookData(similarTitles[book]);
    document.getElementById("similar-titles").innerHTML +=
    `<tr>
      <td>${title}</td>
      <td>${author}</td>
      <td><button id="ok-button" onclick="clickOk('${title}', '${titleKey}', '${author}', '${authorKey}', '${cover_id}', '${year}')">ok</button></td>
    </tr>`
  }
  function showSimilarTitles() {
    var filteredTitles = booksFound.filter( book => book.has_fulltext == true )
    var similarTitles = filteredTitles.slice(1, 11)
    return similarTitles;
  }
}
function clickOk(title, titleKey, author, authorKey, cover_id, year) {
  title = title;
  titleKey = titleKey;
  author = author;
  authorKey = authorKey;
  cover_id = cover_id;
  year = year;
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
      const coverId = bookArchive[book].cover;
      const bookCover = getCover(coverId, 'M');
      document.getElementById(table + "-table").innerHTML +=
        `<div class="myBook">
          ${bookCover}
          <h4>${myBook.title}</h4>
          <h5>${myBook.author}</h5>
        </div>`;
    }
  }
  function clearTables() {
    document.getElementById("finished-table").innerHTML = ``;
    document.getElementById("reading-table").innerHTML = ``;
    document.getElementById("wishlist-table").innerHTML = ``;
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
      const bookCover = getCover(coverId, 'S');
      document.getElementById("favorites").innerHTML += bookCover;
    }
  }
}
function getCover(coverId, size) {
  return `<div id="favorite-${coverId}"><img id="cover-image" src="http://covers.openlibrary.org/b/id/${coverId}-${size}.jpg"></img></div>`
}
window.onload = function enterSearch() {
  const node = document.getElementById("site-search");
  node.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      searchTitle();
    }
  })
};