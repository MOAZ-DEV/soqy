import Featured from "@/components/featured";
import MainLayout from "@/components/main-layout";
import ProductsGrid from "@/components/product/products-grid";
import SortingRow from "@/components/sorting-row";
import { DUMMY_FEATURED } from "@/shared/dummy-featured";
import { DUMMY_PRODUCTS } from "@/shared/dummy-products";
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
	}),
});

function Index() {

	return (
		<MainLayout>
			<Featured slides={DUMMY_FEATURED} />
			<SortingRow />
			<ProductsGrid products={DUMMY_PRODUCTS} />
		</MainLayout>
	);
}

export default Index;
