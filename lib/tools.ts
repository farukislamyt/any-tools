export type Tool = {
  slug: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  href: string;
};

export const tools: Tool[] = [
  { slug: "calculator", name: "Calculator", description: "Quick everyday arithmetic with a clean interface.", category: "Calculators", icon: "calculator", href: "/tools/calculator" },
  { slug: "metal-weight", name: "Metal Weight Calculator", description: "Calculate metal weight from shape, size and material density.", category: "Engineering", icon: "scale", href: "/tools/metal-weight" },
  { slug: "unit-converter", name: "Unit Converter", description: "Convert length, weight, area, volume and temperature.", category: "Converters", icon: "arrow-left-right", href: "/tools/unit-converter" },
  { slug: "percentage", name: "Percentage Calculator", description: "Find percentages, increases, decreases and differences.", category: "Calculators", icon: "percent", href: "/tools/percentage" },
  { slug: "age", name: "Age Calculator", description: "Calculate age precisely from a date of birth.", category: "Everyday", icon: "calendar", href: "/tools/age" },
  { slug: "emi", name: "EMI Calculator", description: "Estimate monthly loan payments and total interest.", category: "Finance", icon: "banknote", href: "/tools/emi" },
];

export const categories = ["All", "Calculators", "Engineering", "Converters", "Everyday", "Finance"];
