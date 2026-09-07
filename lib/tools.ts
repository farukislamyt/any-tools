export type Tool = {
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  href: string;
};

export const tools: Tool[] = [
  { slug: "calculator", name: "Calculator", description: "Basic arithmetic calculator.", category: "Calculators", icon: "calculator", href: "/tools/calculator" },
  { slug: "percentage", name: "Percentage Calculator", description: "Calculate percentages and percentage change.", category: "Calculators", icon: "percent", href: "/tools/percentage" },
  { slug: "metal-weight", name: "Metal Weight Calculator", description: "Calculate steel and metal weight from sections or dimensions.", category: "Engineering", icon: "scale", href: "/tools/metal-weight" },
];

export const categories = ["All", "Calculators", "Engineering"];
