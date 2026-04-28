import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import { Route } from "@/routes";

interface PaginationRowProps extends React.ComponentProps<"div"> {
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  endCursor?: string | null;
  startCursor?: string | null;
}

export default function PaginationRow({
  hasNextPage,
  hasPreviousPage,
  endCursor,
  startCursor,
}: PaginationRowProps) {
  const navigate = Route.useNavigate();

  return (
    <div className="flex flex-col items-center gap-4">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={cn({
                "opacity-45 pointer-events-none": !hasPreviousPage,
              })}
              onClick={(e) => {
                e.preventDefault();
                navigate({
                  to: ".", // stays on the same route
                  search: (prev) => ({
                    ...prev,
                    before: startCursor ?? undefined,
                    after: undefined,
                  }),
                });
              }}
            />
          </PaginationItem>

          {/* <PaginationItem>
            <PaginationLink isActive>{currentPage}</PaginationLink>
          </PaginationItem> */}

          <PaginationItem>
            <PaginationNext
              className={cn({ "opacity-45 pointer-events-none": !hasNextPage })}
              onClick={(e) => {
                e.preventDefault();
                navigate({
                  to: ".", // stays on the same route
                  search: (prev) => ({
                    ...prev,
                    after: endCursor ?? undefined,
                    before: undefined,
                  }),
                });
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
