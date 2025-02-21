"use client";

import { useEffect, useState } from "react";
import Book from "@/components/Book";
import { LocalStorageBook } from "@/types";
import ButtonAsLink from "@/components/ButtonAsLink";
import Link from "next/link";

export default function Favorites() {
  const [favorites, setFavorites] = useState<LocalStorageBook[]>([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(
      localStorage.getItem("favorites") || "[]",
    );
    setFavorites(storedFavorites);
  }, []);

  return (
    <>
      <div className="flex items-center justify-between flex-row p-6 gap-2 bg-stone-300">
        <Link href={"/books/1"}>
          <h1 className="md:text-2xl text-xl font-bold">Online library</h1>
        </Link>
        <div className="flex justify-center items-center gap-2">
          <ButtonAsLink linkToPage={"/books/1"} text="Home"></ButtonAsLink>
        </div>
      </div>
      <div className="flex flex-col items-center p-6">
        {favorites.length === 0 ? (
          <p>No favorite books yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {favorites.map((book) => (
              <Book
                key={book.id}
                id={book.id}
                title={book.title}
                authors={book.authors}
                cover={book.cover}
                summary={book.summary}
                subjects={book.subjects}
                linkTo={book.linkTo}
                onFavoriteToggle={() =>
                  setFavorites([
                    ...JSON.parse(localStorage.getItem("favorites") || "[]"),
                  ])
                }
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
