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