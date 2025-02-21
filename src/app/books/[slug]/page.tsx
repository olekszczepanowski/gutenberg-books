import Book from "@/components/Book";
import ButtonAsLink from "@/components/ButtonAsLink";
import MainPagination from "@/components/Pagination";
import SearchBooksDialog from "@/components/SearchBooksDialog";
import { GutenbergBook } from "@/types";
import Link from "next/link";
import { notFound } from "next/navigation";

async function fetchBooks(page: number) {
  const response = await fetch(`https://gutendex.com/books/?page=${page}`);
  if (!response.ok) return notFound();
  return response.json();
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const page = Number((await params).slug) || 1;

  const data = await fetchBooks(page);

  return (
    <>
      <div className="flex items-center justify-between flex-row p-6 gap-2 bg-stone-300">
        <Link href={"/"}>
          <h1 className="md:text-2xl text-xl font-bold">Online library</h1>
        </Link>
        <div className="flex justify-center items-center gap-2">
          <ButtonAsLink
            linkToPage={`favorites`}
            text="Favorites"
          ></ButtonAsLink>
          <SearchBooksDialog />
        </div>
      </div>
      <div className="flex flex-col items-center p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.results.map((book: GutenbergBook) => (
            <Book
              key={book.id}
              id={book.id}
              title={book.title}
              authors={book.authors}
              cover={book.formats["image/jpeg"] || "/placeholder.jpg"}
              summary={
                book.summaries[0] !== undefined
                  ? book.summaries[0]
                  : "No summary available. We apologize for all the problems."
              }
              subjects={book.subjects || ["No categories"]}
              linkTo={
                book.formats["text/html"] !== undefined
                  ? book.formats["text/html"]
                  : book.formats["application/rdf+xml"]
              }
            />
          ))}
        </div>
        <MainPagination
          currentPage={page}
          nextPage={data.next}
          prevPage={data.previous}
        />
      </div>
    </>
  );
}
