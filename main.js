function fetchData(url) {
  return new Promise((resolve, reject) => {
    console.log(`Making Request to ${url}`)
    resolve(
      fetch(url)
      .then(result => result.json())
      .then(data => {
        for (let book in data.docs) {
          return data.docs[book]
      }})
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
    title = book_info.title;
    author = book_info.author_name[0];
    cover_id = book_info.cover_i;
    document.getElementById("question").innerHTML = 
    `<h2>Did you mean <span>${title}</span> by <span>${author}</span>?</h2></br>`;
    document.getElementById("answer-buttons").style.visibility = "visible";
  } catch (err) {
    document.getElementById("question").innerHTML =
    `<h2>No matches found. Please try another search.</h2>`
  }
}
async function searchTitle() {
  if ( document.getElementById("site-search").value != "" ) {
    const url = generateUrl();
    document.getElementById("question").innerHTML = `<h2>Searching...</h2>`
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
  `<div id="cover-image-container"><img id="cover-image" src="http://covers.openlibrary.org/b/id/10449357-M.jpg"></div>
  <div id="options">
  <p>Add to Finished</p>
  <p>Add to Currently Reading</p>
  <p>Add to Want to Read</p>
  <p>Save to Favorites</p>
  <p>Show title in openlibrary.org</p>
  <p>Show author in openlibrary.org</p>`
  document.getElementById("answer-buttons").style.visibility = "hidden";
  document.getElementById("question").innerHTML = "";
}