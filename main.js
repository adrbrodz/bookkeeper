const url = 'http://openlibrary.org/search.json?title=the+lord+of+the';

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
    reject('No matches found. Please try another search.')
  })
}

function processFetch(response) {
  return new Promise((resolve, reject) => {
    console.log('Processing response')
    resolve(response)
  })
}

async function doWork() {
  const response = await fetchData(url);
  console.log('Response received')
  const book_info = await processFetch(response)
  updateQuestion(book_info);
}

function updateQuestion(book_info) {
  title = book_info.title;
  author = book_info.author_name[0];
  document.getElementById("question").innerHTML = 
  `<h2>Did you mean <span>${title}</span> by <span>${author}?</span></h2>`
}
doWork();