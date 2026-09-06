export type Tool = {
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  href: string;
};

export const tools: Tool[] = [
  {
    slug: "calculator",
    name: "Calculator",
    description: "Free online calculator for addition, subtraction, multiplication and division.",
    category: "Calculators",
    icon: "calculator",
    href: "/tools/calculator",
  },
  {
    slug: "metal-weight",
    name: "Metal Weight Calculator",
    description: "Calculate steel and metal weight from standard sections or custom dimensions.",
    category: "Engineering",
    icon: "scale",
    href: "/tools/metal-weight",
  },
];

export const categories = ["All", "Calculators", "Engineering"];
