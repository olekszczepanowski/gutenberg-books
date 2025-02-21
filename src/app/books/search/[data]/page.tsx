import Book from "@/components/Book";
import ButtonAsLink from "@/components/ButtonAsLink";
import SearchBooksDialog from "@/components/SearchBooksDialog";
import { GutenbergBook } from "@/types";

async function fetchBooks(query: string) {
  const response = await fetch(
    `https://gutendex.com/books/?search=${encodeURIComponent(query)}`,
  );
  if (!response.ok) return null;
  return response.json();
}

export default async function SearchResultsPage({
  params,
}: {
  params: Promise<{ data: string }>;
}) {
  const searchQuery = decodeURIComponent((await params).data || "");
  const data = await fetchBooks(searchQuery);

  return (
    <>
      <div className="flex items-center justify-between flex-row p-6 gap-2 bg-stone-300">
        <h1 className="md:text-2xl text-xl font-bold">
          Search Results for {searchQuery}
        </h1>
        <div className="flex justify-center items-center gap-2">
          <ButtonAsLink linkToPage="/books/favorites" text="Favorites" />
          <SearchBooksDialog />
        </div>
      </div>
      <div className="flex flex-col items-center p-6">
        {!data || data.results.length === 0 ? (
          <p>There were no books matching your criteria</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {data.results.map((book: GutenbergBook) => (
              <Book
                key={book.id}
                id={book.id}
                title={book.title}
                authors={book.authors}
                cover={book.formats["image/jpeg"] || "/placeholder.jpg"}
                summary={book.summaries?.[0] || "No summary available."}
                subjects={book.subjects || ["No categories"]}
                linkTo={
                  book.formats["text/html"] ||
                  book.formats["application/rdf+xml"]
                }
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
