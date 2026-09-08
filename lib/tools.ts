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
  { slug: "metal-weight", name: "Metal Weight Calculator", description: "Calculate steel and metal weight from custom dimensions and material density.", category: "Engineering", icon: "scale", href: "/tools/metal-weight" },
  { slug: "unit-converter", name: "Unit Converter", description: "Convert length, weight, temperature, area and volume units instantly.", category: "Conversion", icon: "arrow-left-right", href: "/tools/unit-converter" },
  { slug: "notes", name: "Notes", description: "Write and save quick notes in your browser.", category: "Writing", icon: "notebook", href: "/tools/notes" },
  { slug: "word-counter", name: "Word Counter", description: "Count words, characters, lines and sentences instantly.", category: "Writing", icon: "file-text", href: "/tools/word-counter" },
  { slug: "document-editor", name: "Document Editor", description: "Write, format, edit and print documents online.", category: "Writing", icon: "file-text", href: "/tools/document-editor" },
];

export const categories = ["All", "Calculators", "Engineering", "Conversion", "Writing"];
