import { Link } from "@tanstack/react-router";
import { useCollections } from "@/hooks/use-collection";

export default function CollectionsMenu() {
  const { data, isLoading } = useCollections();

  if (!data?.collections?.length) return null;

  return (
    <div className="flex max-w-445 w-full mx-auto px-2 py-6">
      <div className="flex flex-col gap-1">
        <span className="text-primary/25">COLLECTIONS</span>
        <ul className="text-primary *:hover:underline *:not-hover:opacity-45 transition duration-600">
          {isLoading
            ? <li>Loading...</li>
            : data.collections.map(({ id, title, handle }) => (
              <Link key={id} to={`/collections/$handle`} params={{ handle }}>
                <li className="uppercase">{title}</li>
              </Link>
            ))}
        </ul>
      </div>
    </div>
  );
}
