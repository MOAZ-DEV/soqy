import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

export default function StoreMenu({
  open,
  onToggle,
  className,
}: {
  open: boolean;
  onToggle: (v: boolean) => void;
  className?: string;
}) {
  return (
    <Button
      variant="link"
      className={cn("gap-1 not-hover:opacity-75 transition", className)}
      onClick={() => onToggle(!open)}
    >
      STORE
      <Plus
        strokeWidth={1.5}
        className={cn("transition-all duration-700", open && "rotate-135")}
      />
    </Button>
  );
}
