const url = 'http://openlibrary.org/search.json?title=the+lord+of+the+rings';
var book_info;
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

const thebooks = getData(url, book_info => {
  console.log(book_info.title);
});