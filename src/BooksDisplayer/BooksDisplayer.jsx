import "./booksdisplayer.css";
import React, { useState, useEffect } from 'react';

function BooksDisplayer() {
   const [records, setRecords] = useState([]);
   const [expandedBook, setExpandedBook] = useState(null);
   const [filteredBooks, setFilteredBooks] = useState([]);
   const [favorites, setFavorites] = useState([]);
   const [category, setCategory] = useState("All");
   const [name, setName] = useState("");
   const [isLoading, setIsLoading] = useState(true);


   // Fetching data from API
   useEffect(() => {
      setIsLoading(true);
      fetch("https://gutendex.com/books")
         .then(response => response.json())
         .then(data => {
            const modifiedData = data.results.map(book => {
                const modifiedFormats = {};
                for (const key in book.formats) {
                   if (book.formats[key].startsWith("http://")) {
                      modifiedFormats[key] = book.formats[key].replace("http://", "https://");
                   } else {
                      modifiedFormats[key] = book.formats[key];
                   }
                }
                return { ...book, formats: modifiedFormats };
             });
             setRecords(modifiedData);
             setIsLoading(false);
          })
          .catch(error => {
             console.error(error);
             setIsLoading(false);
          });
   }, [])

   //Filtering books by categories/name
   useEffect(() => {
      const filteredBooks = filterByCategories(records, category);
      setFilteredBooks(filteredBooks);
      setExpandedBook(null);
   }, [category, records, favorites]);

   useEffect(() => {
      const filteredBooks = filterByName(records, name);
      setFilteredBooks(filteredBooks);
      setExpandedBook(null);
   }, [name, records]);
   
   function filterByCategories(records, category){
      if (category === "All") {
         return records;
     }

     if (category === "Favorite"){
      return favorites;
     }
 
     const regex = new RegExp(category);
 
     const filteredBooks = records.filter(book => {
         const subjects = book.subjects || [];
         return subjects.some(subject => regex.test(subject));
     });
 
     return filteredBooks;
   }


   function filterByName(records, name){
      const nameToLowerCase = name.toLowerCase();
      const filteredBooks = records.filter(book =>{
         const title = book.title.toLowerCase();
         return title.includes(nameToLowerCase);
      });

      return filteredBooks;
   }

   function handleInputChange(event){
      setName(event.target.value);
   }


   //Displaying author/authors
   function displayAuthors(authors){
      let output = ``;
      
      if (authors.length > 1) {
          const firstAuthor = authors[0].name;
          let [lastNameOfFirstAuthor, firstNameOfFirstAuthor] = firstAuthor.split(", ")
          
          const secondAuthor = authors[1].name;
          let [lastNameOfSecondAuthor, firstNameOfSecondAuthor] = secondAuthor.split(", ");
          
          if(firstNameOfFirstAuthor === undefined || firstNameOfSecondAuthor === undefined){
              firstNameOfFirstAuthor = "";
              firstNameOfSecondAuthor = ""; 
          }
          
          output = `Authors: ${firstNameOfFirstAuthor} ${lastNameOfFirstAuthor}, ${firstNameOfSecondAuthor} ${lastNameOfSecondAuthor}`;
      } else {
          const author = authors[0].name;
          let [lastName, firstName] = author.split(", ");
          output = `Author: ${firstName} ${lastName}`;
      }
      return output;
   }


   //function to enable user to read specific book
   function toggleExpand(bookIndex) {
      setExpandedBook(expandedBook === bookIndex ? null : bookIndex);
   }

   function toggleFavourite(bookIndex) {
      const book = filteredBooks[bookIndex];
      if (favorites.includes(book)) {
         setFavorites(favorites.filter(id => id !== book));
     } else {
         setFavorites([...favorites, book]);
     }

   //function to createBookUrl, because API's urls are causing HTTP errors
  }
  function createBookUrl(bookId) {
    return `https://www.gutenberg.org/cache/epub/${bookId}/pg${bookId}-images.html`;
 }

   return (
      <>
      <div id="navbar">
        <div id="categories"> 
            <button className="category-button" onClick={() => setCategory("All")}>All</button>
            <button className="category-button" onClick={() => setCategory("Fiction")}>Fiction</button>
            <button className="category-button" onClick={() => setCategory("Drama")}>Drama</button>
            <button className="category-button" onClick={() => setCategory("Horror")}>Horror</button>
            <button className="category-button" onClick={() => setCategory("Favorite")}>Favourite</button>
        </div>
        
        <div id="search-container">
            <input id ="search-input" value= {name} onChange={handleInputChange}type="text" placeholder="Type in your book title!"></input>
        </div>
    </div>
    {isLoading && <div id="loading-div">Loading...</div>}
      {/* displaying books on page */}
      <div className="books-displayer">
         <ul id="books-list">
            
            {filteredBooks.map((book, index) => (
               <li className={`books-element ${favorites.includes(book) ? 'favorite' : ''}`} key={index}>
                  <div className="upper-side-li">
                     <div className="display-book-div">
                        <div>
                           "{book.title.includes("A Modest Proposal") ? 
                              `A Modest Proposal` : book.title}"
                        </div> 
                        <div>
                           {displayAuthors(book.authors)}
                        </div>
                     </div>
                     <div className="right-side-li">
                        <button className="expand-button" onClick={() => toggleExpand(index)}>
                           <span className="material-symbols-outlined">menu_book</span>
                           </button>
                        <button className="favourite-button" onClick={() => toggleFavourite(index)}>
                           <span className="material-symbols-outlined">favorite</span>
                           </button>
                     </div>
                  </div>
                  <div id="content-div" key={`content-${index}`}>
               {expandedBook === index && (
                  <iframe className="book-content" 
                     src={createBookUrl(book.id)} ></iframe>
               )}
            </div>
               </li>
            ))}
         
         </ul>
      </div>
      </>
   );
}

export default BooksDisplayer;