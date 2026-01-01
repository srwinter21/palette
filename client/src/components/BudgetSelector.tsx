import { cn } from "@/lib/utils";
import { DollarSign, Award, Gem } from "lucide-react";

type BudgetTier = "budget" | "mid" | "luxury";

interface BudgetSelectorProps {
  selected: BudgetTier;
  onSelect: (tier: BudgetTier) => void;
}

export function BudgetSelector({ selected, onSelect }: BudgetSelectorProps) {
  const tiers = [
    {
      id: "budget" as const,
      icon: DollarSign,
      label: "Budget Friendly",
      desc: "Smart, cost-effective updates that make a big impact."
    },
    {
      id: "mid" as const,
      icon: Award,
      label: "Mid-Range",
      desc: "Quality materials and balanced renovations for lasting value."
    },
    {
      id: "luxury" as const,
      icon: Gem,
      label: "Premium Luxury",
      desc: "High-end finishes and complete transformations without compromise."
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {tiers.map((tier) => {
        const Icon = tier.icon;
        const isSelected = selected === tier.id;

        return (
          <button
            key={tier.id}
            onClick={() => onSelect(tier.id)}
            className={cn(
              "relative p-5 rounded-xl border-2 text-left transition-all duration-300 ease-out group",
              isSelected
                ? "border-primary bg-primary/5 shadow-lg shadow-primary/5 ring-1 ring-primary/20"
                : "border-border hover:border-primary/30 hover:bg-muted/30"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300",
              isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
            )}>
              <Icon size={20} />
            </div>
            <h4 className={cn("font-semibold mb-1", isSelected ? "text-primary" : "text-foreground")}>
              {tier.label}
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {tier.desc}
            </p>

            {isSelected && (
              <div className="absolute top-4 right-4 w-3 h-3 bg-primary rounded-full animate-pulse" />
            )}
          </button>
        );
      })}
    </div>
  );
}
