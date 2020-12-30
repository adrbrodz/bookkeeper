const url = 'http://openlibrary.org/search.json?title=room+of+ones';

function getData(url, callback) {
  fetch(url)
  .then(res => res.json())
  .then(data => {
    for (let book in data.docs) {
      book_info = data.docs[book]
      break
    }
  callback(book_info);
  })
};
function getBookInfo() {
  getData(url, book_info => {
    title = book_info.title
    author = book_info.author_name[0]
    document.getElementById("question").innerHTML = 
    `<h2>Did you mean <span>${title}</span> by <span>${author}?</span></h2>`
  });
}