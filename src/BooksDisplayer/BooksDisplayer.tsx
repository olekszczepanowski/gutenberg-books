import type React from "react";
import { useEffect, useState } from "react";

import "./booksdisplayer.css";

function BooksDisplayer() {
  const [records, setRecords] = useState<Book[]>([]);
  const [expandedBook, setExpandedBook] = useState<number | null>(null);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [favorites, setFavorites] = useState<Book[]>([]);
  const [category, setCategory] = useState("All");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  interface Book {
    id: number;
    title: string;
    authors: Array<{ name: string; birth_year?: number; death_year?: number }>;
    subjects: string[];
    bookshelves: string[];
    copyright: boolean;
    download_count: number;
    formats: { [format: string]: string };
    languages: string[];
    media_type: string;
    translators: unknown[];
  }
  // Fetching data from API
  useEffect(() => {
    setIsLoading(true);
    fetch("https://gutendex.com/books")
      .then((response) => response.json())
      .then((data: { results: Book[] }) => {
        setRecords(data.results);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        throw new Error(error as string);
      });
  }, []);
  //Filtering books by categories/name
  useEffect(() => {
    function filterByCategories() {
      if (category === "All") {
        return records;
      }
      if (category === "Favorite") {
        return favorites;
      }
      const regex = new RegExp(category);

      const outputFilteredBooks = records.filter((book) => {
        const subjects = book.subjects;
        return subjects.some((subject: string) => regex.test(subject));
      });
      return outputFilteredBooks;
    }
    setFilteredBooks(filterByCategories());
    setExpandedBook(null);
  }, [category, records, favorites]);

  useEffect(() => {
    function filterByName() {
      const nameToLowerCase = name.toLowerCase();
      const outputFilteredBooks = records.filter((book: { title: string }) => {
        const title = book.title.toLowerCase();
        return title.includes(nameToLowerCase);
      });

      return outputFilteredBooks;
    }
    setFilteredBooks(filterByName());
    setExpandedBook(null);
  }, [records, name]);

  function handleInputChange(event: {
    target: { value: React.SetStateAction<string> };
  }) {
    setName(event.target.value);
  }

  //Displaying author/authors
  function displayAuthors(authors: Array<{ name: string }>): string {
    let output = ``;
    if (authors.length > 0) {
      const firstAuthor = authors[0]?.name ?? "";
      const fullNameOfFirstAuthor = firstAuthor.split(", ");
      const lastNameOfFirstAuthor = fullNameOfFirstAuthor[0];
      const firstNameOfFirstAuthor = fullNameOfFirstAuthor[1];

      if (authors.length > 1) {
        const secondAuthor = authors[1]?.name ?? "";
        const fullNameOfSecondAuthor = secondAuthor.split(", ");
        const lastNameOfSecondAuthor = fullNameOfSecondAuthor[0];
        const firstNameOfSecondAuthor = fullNameOfSecondAuthor[1];

        output = `Authors: ${firstNameOfFirstAuthor} ${lastNameOfFirstAuthor}, ${firstNameOfSecondAuthor} ${lastNameOfSecondAuthor}`;
      } else {
        output = `Author: ${firstNameOfFirstAuthor} ${lastNameOfFirstAuthor}`;
      }
    } else {
      output = "Unknown authors";
    }

    return output;
  }

  //function to enable user to read specific book
  function toggleExpand(bookIndex: number) {
    setExpandedBook(expandedBook === bookIndex ? null : bookIndex);
  }

  function toggleFavourite(bookIndex: number) {
    const book = filteredBooks[bookIndex];
    if (book) {
      const isFavourite = favorites.some((favBook) => favBook.id === book.id);
      if (isFavourite) {
        setFavorites(favorites.filter((favBook) => favBook.id !== book.id));
      } else {
        setFavorites([...favorites, book]);
      }
    }

    //function to createBookUrl, because API's urls are causing HTTP errors
  }
  function createBookUrl(bookId: number) {
    return `https://www.gutenberg.org/cache/epub/${bookId}/pg${bookId}-images.html`;
  }

  return (
    <>
      <div id="navbar">
        <div id="categories">
          <button
            className="category-button"
            onClick={() => {
              setCategory("All");
            }}
          >
            All
          </button>
          <button
            className="category-button"
            onClick={() => {
              setCategory("Fiction");
            }}
          >
            Fiction
          </button>
          <button
            className="category-button"
            onClick={() => {
              setCategory("Drama");
            }}
          >
            Drama
          </button>
          <button
            className="category-button"
            onClick={() => {
              setCategory("Horror");
            }}
          >
            Horror
          </button>
          <button
            className="category-button"
            onClick={() => {
              setCategory("Favorite");
            }}
          >
            Favourite
          </button>
        </div>

        <div id="search-container">
          <input
            id="search-input"
            value={name}
            onChange={handleInputChange}
            type="text"
            placeholder="Type in your book title!"
          />
        </div>
      </div>
      {isLoading ? <div id="loading-div">Loading...</div> : null}
      <div className="books-displayer">
        <ul id="books-list">
          {filteredBooks.map((book, index) => (
            <li
              className={`books-element ${favorites.includes(book) ? "favorite" : ""}`}
              key={index}
            >
              <div className="upper-side-li">
                <div className="display-book-div">
                  <div>&quot;{book.title}&quot;</div>
                  <div>{displayAuthors(book.authors)}</div>
                </div>
                <div className="right-side-li">
                  <button
                    className="expand-button"
                    onClick={() => {
                      toggleExpand(index);
                    }}
                  >
                    <span className="material-symbols-outlined">menu_book</span>
                  </button>
                  <button
                    className="favourite-button"
                    onClick={() => {
                      toggleFavourite(index);
                    }}
                  >
                    <span className="material-symbols-outlined">favorite</span>
                  </button>
                </div>
              </div>
              <div id="content-div" key={`content-${index}`}>
                {expandedBook === index && (
                  <iframe
                    title="iframe-title"
                    className="book-content"
                    src={createBookUrl(book.id)}
                  />
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
