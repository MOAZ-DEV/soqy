import MainLayout from "@/components/main-layout";
import ProductsGrid from "@/components/product/products-grid";
import SortingRow from "@/components/sorting-row";
import { useProducts } from "@/hooks/use-product";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

export const Route = createFileRoute("/products/")({
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
	const { } = useProducts({
		after,
		before,
		sortKey: sort,
		query
	})

	return (
		<MainLayout>
			<SortingRow />
			<ProductsGrid  {...data} />
		</MainLayout>
	)
}

export default Index;
