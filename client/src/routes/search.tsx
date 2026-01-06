import { z } from "zod"
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/search')({
    component: RouteComponent,
    validateSearch: z.object({
        sort: z
            .enum([
                "featured",
                "best-selling",
                "newest",
                "price-asc",
                "price-desc"
            ])
            .optional()
    })
})

function RouteComponent() {
    return <div>Hello "/search"!</div>
}
