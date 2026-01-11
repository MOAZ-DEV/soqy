import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, X } from "lucide-react"
import { Route } from "@/routes/index"
import { useState } from "react"
import { Input } from "./ui/input"

const OPTIONS = [
    { label: "Featured", value: "featured" },
    { label: "Best selling", value: "best-selling" },
    { label: "Newest", value: "newest" },
    { label: "Oldest", value: "oldest" },
    { label: "Price ↑", value: "price-asc" },
    { label: "Price ↓", value: "price-desc" },
] as const

type SortValue = (typeof OPTIONS)[number]["value"]

export default function SortingRow() {
    const navigate = Route.useNavigate()
    const { sort } = Route.useSearch()
    const [searchTerm, setSearchTerm] = useState("")

    const toggleReverse = () => {
        if (sort === "newest") setSort("oldest")
        else if (sort === "oldest") setSort("newest")
        else if (sort === "price-asc") setSort("price-desc")
        else if (sort === "price-desc") setSort("price-asc")
        else setSort("price-asc")
    }

    const setSort = (value: SortValue) =>
        navigate({
            search: (prev) => ({
                ...prev,
                sort: value,
                after: undefined,
                before: undefined
            }),
        })

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
        navigate({
            search: (prev) => ({
                ...prev,
                query: e.target.value || undefined,
                after: undefined,
                before: undefined
            }),
        })
    }

    return (
        <div className="flex flex-row gap-2 max-w-445 items-center justify-between w-full mx-auto px-3 py-1 sticky top-16 sm:top-18 z-30">
            <div className="flex flex-row gap-2 items-center">
                <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="flex-1 w-full sm:max-w-64 outline-0 backdrop-blur-sm"
                />
                <Button
                    variant="ghost"
                    size="icon"
                    hidden={searchTerm === ""}
                    onClick={() =>
                        handleSearchChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>)
                    }>
                    <X />
                </Button>
            </div>

            <div className="flex flex-row items-center justify-end gap-2 *:backdrop-blur-sm">
                <Button
                    variant="secondary"
                    size="icon"
                    onClick={toggleReverse}
                    disabled={sort === "best-selling" || sort === "featured"}
                    className="max-sm:hidden"
                >
                    <ArrowUpDown className="h-4 w-4" />
                </Button>

                <Select value={sort ?? "featured"} onValueChange={setSort}>
                    <SelectTrigger className="w-140px">
                        <SelectValue />
                    </SelectTrigger>

                    <SelectContent>
                        {OPTIONS.map((o) => (
                            <SelectItem key={o.value} value={o.value}>
                                {o.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
