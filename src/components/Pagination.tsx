import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function MainPagination({
  currentPage,
  nextPage,
  prevPage,
}: {
  currentPage: number;
  nextPage: string | null;
  prevPage: string | null;
}) {
  return (
    <Pagination className="mt-2">
      <PaginationContent>
        {prevPage && (
          <PaginationItem>
            <PaginationPrevious href={`/books/${currentPage - 1}`} />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink href="/books/1">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="/books/2">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          {nextPage && <PaginationNext href={`/books/${currentPage + 1}`} />}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
