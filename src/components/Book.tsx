"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, BookOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ButtonAsLink from "./ButtonAsLink";
import { Author, GutenbergBook } from "@/types";
import { useEffect, useState } from "react";
import { ScrollArea } from "./ui/scroll-area";

export default function Book({
  id,
  title,
  cover,
  authors,
  summary,
  linkTo,
  subjects,
  onFavoriteToggle,
}: {
  id: number;
  title: string;
  cover: string;
  authors: Author[];
  summary: string;
  linkTo: string;
  subjects: string[];
  onFavoriteToggle?: () => void;
}) {
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.some((book: GutenbergBook) => book.id === id));
  }, [id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

    if (isFavorite) {
      const updatedFavorites = favorites.filter(
        (book: GutenbergBook) => book.id !== id,
      );
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
      setIsFavorite(false);
    } else {
      const newBook = { id, title, cover, authors, summary, linkTo, subjects };
      localStorage.setItem(
        "favorites",
        JSON.stringify([...favorites, newBook]),
      );
      setIsFavorite(true);
    }

    if (onFavoriteToggle) onFavoriteToggle();
  };

  const transformedSubjects = subjects
    .map((subject) => subject.split("--")[0].trim())
    .join(", ");

  const transformedAuthors = authors.map((author) => author.name).join();

  return (
    <div className="flex justify-between items-center flex-col p-4 border-2 gap-3 bg-stone-100 rounded-md">
      <div className="flex justify-between items-center flex-col h-full p-4 gap-2">
        <p className="text-justify" style={{ textAlignLast: "center" }}>
          {title}
        </p>
        <div
          className="relative"
          style={{ minHeight: "140px", minWidth: "100px" }}
        >
          <Image src={cover} fill={true} alt={`Book cover for ${title}`} />
        </div>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            <BookOpen />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-screen w-11/12">
          <DialogHeader className="px-4">
            <DialogTitle>Additional information</DialogTitle>
            <DialogDescription>Author: {transformedAuthors}</DialogDescription>
            <DialogDescription>
              Categories: {transformedSubjects}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <ScrollArea className="h-60 max-h-72  px-4 text-justify">
              {summary}
            </ScrollArea>
            <div className="flex justify-center items-center gap-2">
              <ButtonAsLink linkToPage={linkTo} text="Read" />
              <Button type="button" onClick={toggleFavorite}>
                <span className="sr-only">Add to favorites</span>
                <Heart
                  className={isFavorite ? "text-red-500 fill-red-500" : ""}
                />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
