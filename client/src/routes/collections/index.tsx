import MainLayout from "@/components/main-layout";
// import ProductsGrid from "@/components/product/products-grid";
import SortingRow from "@/components/sorting-row";
// import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod";

export const Route = createFileRoute("/collections/")({
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
	// const { sort, query, after, before } = Route.useSearch();

	// const { data } = useQuery({
	// 	queryKey: ["collection-products", { sort, query, after, before }],
	// 	queryFn: async () => {
	// 		const params = new URLSearchParams();
	// 		if (sort) params.set("sort", encodeURIComponent(sort));
	// 		if (query) params.set("query", encodeURIComponent(query));
	// 		const response = await fetch(`http://localhost:3000/collection/${}/products/?${params.toString()}`);
	// 		console.log('Fetching products with params:', params.toString());
	// 		if (!response.ok) throw new Error("Failed to fetch products");
	// 		return await response.json();
	// 	},
	// });

	return (
		<MainLayout>
			<SortingRow />
			{/* <ProductsGrid /> */}
		</MainLayout>
	)
}

export default Index;
