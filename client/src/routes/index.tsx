import Featured from "@/components/featured";
import MainLayout from "@/components/main-layout";
import ProductsGrid from "@/components/product/products-grid";
import SortingRow from "@/components/sorting-row";
import { DUMMY_FEATURED } from "@/shared/dummy-featured";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

export const Route = createFileRoute("/")({
	component: Index,
	validateSearch: z.object({
		sort: z
			.enum([
				"featured",
				"best-selling",
				"newest",
				"oldest",
				"price-asc",
				"price-desc",
			])
			.optional(),
		query: z.string().optional(),
		after: z.string().optional(),
		before: z.string().optional(),
	}),
});

function Index() {
	const { sort, query, after, before } = Route.useSearch();
	const params = new URLSearchParams();
	if (sort) params.set("sort", encodeURIComponent(sort));
	if (query) params.set("query", encodeURIComponent(query));
	if (after) params.set("after", (after));
	if (before) params.set("before", (before));

	const { data } = useQuery({
		queryKey: ["products", { sort, query, after, before }],
		queryFn: async () => {
			const response = await fetch(`https://soqy.moaz-dev.workers.dev/api/products?${params.toString()}`);
			return await response.json();
		}
	});

	return (
		<MainLayout>
			<Featured slides={DUMMY_FEATURED} />
			<SortingRow />
			<ProductsGrid {...data} />
		</MainLayout>
	);
}

export default Index;
