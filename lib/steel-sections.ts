export type SteelSection = {
  designation: string;
  family: "ISMB" | "ISLB" | "ISWB" | "ISHB" | "ISMC" | "ISLC" | "ISA" | "SHS" | "RHS" | "IS1161";
  massKgPerM: number;
  depthMm?: number;
  widthMm?: number;
  thicknessMm?: number;
};

// Weight-per-metre catalogue values used for quantity estimation.
// Standards represented: IS 808 rolled sections, IS 4923 hollow sections,
// and IS 1161 round steel tubes. Verify the current standard/mill table before
// procurement, fabrication or structural design.
export const steelSections: SteelSection[] = [
  // ISMB
  { designation: "ISMB 100", family: "ISMB", massKgPerM: 11.5, depthMm: 100, widthMm: 75 },
  { designation: "ISMB 125", family: "ISMB", massKgPerM: 13, depthMm: 125, widthMm: 75 },
  { designation: "ISMB 150", family: "ISMB", massKgPerM: 14.9, depthMm: 150, widthMm: 80 },
  { designation: "ISMB 175", family: "ISMB", massKgPerM: 19.1, depthMm: 175, widthMm: 90 },
  { designation: "ISMB 200", family: "ISMB", massKgPerM: 25.4, depthMm: 200, widthMm: 100 },
  { designation: "ISMB 225", family: "ISMB", massKgPerM: 31.2, depthMm: 225, widthMm: 110 },
  { designation: "ISMB 250", family: "ISMB", massKgPerM: 37.3, depthMm: 250, widthMm: 125 },
  { designation: "ISMB 300", family: "ISMB", massKgPerM: 44.2, depthMm: 300, widthMm: 140 },
  { designation: "ISMB 350", family: "ISMB", massKgPerM: 52.4, depthMm: 350, widthMm: 140 },
  { designation: "ISMB 400", family: "ISMB", massKgPerM: 61.6, depthMm: 400, widthMm: 140 },
  { designation: "ISMB 450", family: "ISMB", massKgPerM: 72.4, depthMm: 450, widthMm: 150 },
  { designation: "ISMB 500", family: "ISMB", massKgPerM: 86.9, depthMm: 500, widthMm: 180 },
  { designation: "ISMB 550", family: "ISMB", massKgPerM: 103.7, depthMm: 550, widthMm: 190 },
  { designation: "ISMB 600", family: "ISMB", massKgPerM: 122.6, depthMm: 600, widthMm: 210 },

  // ISLB / ISWB / ISHB common catalogue sizes
  { designation: "ISLB 100", family: "ISLB", massKgPerM: 8.7, depthMm: 100, widthMm: 50 },
  { designation: "ISLB 125", family: "ISLB", massKgPerM: 11.1, depthMm: 125, widthMm: 70 },
  { designation: "ISLB 150", family: "ISLB", massKgPerM: 13.5, depthMm: 150, widthMm: 80 },
  { designation: "ISLB 175", family: "ISLB", massKgPerM: 16.1, depthMm: 175, widthMm: 90 },
  { designation: "ISLB 200", family: "ISLB", massKgPerM: 18.8, depthMm: 200, widthMm: 100 },
  { designation: "ISLB 250", family: "ISLB", massKgPerM: 25.1, depthMm: 250, widthMm: 125 },
  { designation: "ISLB 300", family: "ISLB", massKgPerM: 32.9, depthMm: 300, widthMm: 140 },
  { designation: "ISLB 350", family: "ISLB", massKgPerM: 41.4, depthMm: 350, widthMm: 140 },
  { designation: "ISLB 400", family: "ISLB", massKgPerM: 49.4, depthMm: 400, widthMm: 140 },
  { designation: "ISLB 450", family: "ISLB", massKgPerM: 56.9, depthMm: 450, widthMm: 150 },
  { designation: "ISLB 500", family: "ISLB", massKgPerM: 67.7, depthMm: 500, widthMm: 180 },
  { designation: "ISLB 600", family: "ISLB", massKgPerM: 86.8, depthMm: 600, widthMm: 180 },

  { designation: "ISWB 150", family: "ISWB", massKgPerM: 17, depthMm: 150, widthMm: 100 },
  { designation: "ISWB 175", family: "ISWB", massKgPerM: 22.1, depthMm: 175, widthMm: 125 },
  { designation: "ISWB 200", family: "ISWB", massKgPerM: 25.1, depthMm: 200, widthMm: 140 },
  { designation: "ISWB 225", family: "ISWB", massKgPerM: 31, depthMm: 225, widthMm: 150 },
  { designation: "ISWB 250", family: "ISWB", massKgPerM: 37.3, depthMm: 250, widthMm: 200 },
  { designation: "ISWB 300", family: "ISWB", massKgPerM: 48.2, depthMm: 300, widthMm: 200 },
  { designation: "ISWB 350", family: "ISWB", massKgPerM: 56.9, depthMm: 350, widthMm: 200 },
  { designation: "ISWB 400", family: "ISWB", massKgPerM: 66.7, depthMm: 400, widthMm: 200 },
  { designation: "ISWB 450", family: "ISWB", massKgPerM: 79.4, depthMm: 450, widthMm: 200 },
  { designation: "ISWB 500", family: "ISWB", massKgPerM: 95.2, depthMm: 500, widthMm: 250 },
  { designation: "ISWB 550", family: "ISWB", massKgPerM: 112.5, depthMm: 550, widthMm: 250 },
  { designation: "ISWB 600", family: "ISWB", massKgPerM: 133.7, depthMm: 600, widthMm: 250 },

  { designation: "ISHB 150", family: "ISHB", massKgPerM: 30.6, depthMm: 150, widthMm: 150 },
  { designation: "ISHB 200", family: "ISHB", massKgPerM: 40.8, depthMm: 200, widthMm: 200 },
  { designation: "ISHB 250", family: "ISHB", massKgPerM: 51, depthMm: 250, widthMm: 250 },
  { designation: "ISHB 300", family: "ISHB", massKgPerM: 58.8, depthMm: 300, widthMm: 250 },
  { designation: "ISHB 350", family: "ISHB", massKgPerM: 68.2, depthMm: 350, widthMm: 250 },
  { designation: "ISHB 400", family: "ISHB", massKgPerM: 77.6, depthMm: 400, widthMm: 250 },
  { designation: "ISHB 450", family: "ISHB", massKgPerM: 88.3, depthMm: 450, widthMm: 250 },

  // ISMC / ISLC
  { designation: "ISMC 75", family: "ISMC", massKgPerM: 6.8, depthMm: 75, widthMm: 40 },
  { designation: "ISMC 100", family: "ISMC", massKgPerM: 9.2, depthMm: 100, widthMm: 50 },
  { designation: "ISMC 125", family: "ISMC", massKgPerM: 12.7, depthMm: 125, widthMm: 65 },
  { designation: "ISMC 150", family: "ISMC", massKgPerM: 16.4, depthMm: 150, widthMm: 75 },
  { designation: "ISMC 175", family: "ISMC", massKgPerM: 19.1, depthMm: 175, widthMm: 75 },
  { designation: "ISMC 200", family: "ISMC", massKgPerM: 22.1, depthMm: 200, widthMm: 75 },
  { designation: "ISMC 250", family: "ISMC", massKgPerM: 30.4, depthMm: 250, widthMm: 80 },
  { designation: "ISMC 300", family: "ISMC", massKgPerM: 36.3, depthMm: 300, widthMm: 90 },
  { designation: "ISMC 350", family: "ISMC", massKgPerM: 42.1, depthMm: 350, widthMm: 100 },
  { designation: "ISMC 400", family: "ISMC", massKgPerM: 49.4, depthMm: 400, widthMm: 100 },
  { designation: "ISLC 100", family: "ISLC", massKgPerM: 7.6, depthMm: 100, widthMm: 50 },
  { designation: "ISLC 150", family: "ISLC", massKgPerM: 13.3, depthMm: 150, widthMm: 50 },
  { designation: "ISLC 200", family: "ISLC", massKgPerM: 18.4, depthMm: 200, widthMm: 60 },
  { designation: "ISLC 250", family: "ISLC", massKgPerM: 24.4, depthMm: 250, widthMm: 60 },

  // Common ISA equal/unequal angles
  { designation: "ISA 40×40×5", family: "ISA", massKgPerM: 3, widthMm: 40, thicknessMm: 5 },
  { designation: "ISA 50×50×5", family: "ISA", massKgPerM: 3.8, widthMm: 50, thicknessMm: 5 },
  { designation: "ISA 50×50×6", family: "ISA", massKgPerM: 4.5, widthMm: 50, thicknessMm: 6 },
  { designation: "ISA 65×65×6", family: "ISA", massKgPerM: 5.8, widthMm: 65, thicknessMm: 6 },
  { designation: "ISA 65×65×8", family: "ISA", massKgPerM: 7.7, widthMm: 65, thicknessMm: 8 },
  { designation: "ISA 75×75×6", family: "ISA", massKgPerM: 6.8, widthMm: 75, thicknessMm: 6 },
  { designation: "ISA 75×75×8", family: "ISA", massKgPerM: 8.9, widthMm: 75, thicknessMm: 8 },
  { designation: "ISA 90×90×8", family: "ISA", massKgPerM: 10.8, widthMm: 90, thicknessMm: 8 },
  { designation: "ISA 100×100×8", family: "ISA", massKgPerM: 12.1, widthMm: 100, thicknessMm: 8 },
  { designation: "ISA 100×100×10", family: "ISA", massKgPerM: 14.9, widthMm: 100, thicknessMm: 10 },
  { designation: "ISA 130×130×10", family: "ISA", massKgPerM: 19.7, widthMm: 130, thicknessMm: 10 },
  { designation: "ISA 150×150×12", family: "ISA", massKgPerM: 27.2, widthMm: 150, thicknessMm: 12 },
  { designation: "ISA 200×200×15", family: "ISA", massKgPerM: 41.1, widthMm: 200, thicknessMm: 15 },
  { designation: "ISA 200×200×20", family: "ISA", massKgPerM: 53.9, widthMm: 200, thicknessMm: 20 },
  { designation: "ISA 30×20×3", family: "ISA", massKgPerM: 1.14, widthMm: 30, thicknessMm: 3 },
  { designation: "ISA 50×40×5", family: "ISA", massKgPerM: 3.47, widthMm: 50, thicknessMm: 5 },
  { designation: "ISA 75×50×6", family: "ISA", massKgPerM: 5.76, widthMm: 75, thicknessMm: 6 },
  { designation: "ISA 100×75×8", family: "ISA", massKgPerM: 10.7, widthMm: 100, thicknessMm: 8 },
  { designation: "ISA 150×100×12", family: "ISA", massKgPerM: 22.2, widthMm: 150, thicknessMm: 12 },

  // Representative IS 4923 SHS/RHS catalogue sizes.
  { designation: "SHS 25×25×2", family: "SHS", massKgPerM: 1.43, depthMm: 25, widthMm: 25, thicknessMm: 2 },
  { designation: "SHS 40×40×3", family: "SHS", massKgPerM: 3.39, depthMm: 40, widthMm: 40, thicknessMm: 3 },
  { designation: "SHS 50×50×3.2", family: "SHS", massKgPerM: 4.46, depthMm: 50, widthMm: 50, thicknessMm: 3.2 },
  { designation: "SHS 60×60×4", family: "SHS", massKgPerM: 6.71, depthMm: 60, widthMm: 60, thicknessMm: 4 },
  { designation: "SHS 75×75×4", family: "SHS", massKgPerM: 8.6, depthMm: 75, widthMm: 75, thicknessMm: 4 },
  { designation: "SHS 100×100×4", family: "SHS", massKgPerM: 11.7, depthMm: 100, widthMm: 100, thicknessMm: 4 },
  { designation: "SHS 100×100×5", family: "SHS", massKgPerM: 14.6, depthMm: 100, widthMm: 100, thicknessMm: 5 },
  { designation: "SHS 150×150×6", family: "SHS", massKgPerM: 26.4, depthMm: 150, widthMm: 150, thicknessMm: 6 },
  { designation: "RHS 50×25×2.5", family: "RHS", massKgPerM: 2.62, depthMm: 50, widthMm: 25, thicknessMm: 2.5 },
  { designation: "RHS 50×25×3.2", family: "RHS", massKgPerM: 3.24, depthMm: 50, widthMm: 25, thicknessMm: 3.2 },
  { designation: "RHS 80×40×3.2", family: "RHS", massKgPerM: 5.5, depthMm: 80, widthMm: 40, thicknessMm: 3.2 },
  { designation: "RHS 100×50×4", family: "RHS", massKgPerM: 8.59, depthMm: 100, widthMm: 50, thicknessMm: 4 },
  { designation: "RHS 150×100×5", family: "RHS", massKgPerM: 18.34, depthMm: 150, widthMm: 100, thicknessMm: 5 },
  { designation: "RHS 200×100×6", family: "RHS", massKgPerM: 26.4, depthMm: 200, widthMm: 100, thicknessMm: 6 },

  // IS 1161 round pipe examples. Nominal bore is used in the designation.
  { designation: "IS1161 NB 50 × 3.0", family: "IS1161", massKgPerM: 4.24, widthMm: 60.3, thicknessMm: 3 },
  { designation: "IS1161 NB 65 × 3.0", family: "IS1161", massKgPerM: 5.41, widthMm: 76.1, thicknessMm: 3 },
  { designation: "IS1161 NB 80 × 3.0", family: "IS1161", massKgPerM: 6.36, widthMm: 88.9, thicknessMm: 3 },
  { designation: "IS1161 NB 100 × 3.6", family: "IS1161", massKgPerM: 8.8, widthMm: 114.3, thicknessMm: 3.6 },
  { designation: "IS1161 NB 150 × 4.5", family: "IS1161", massKgPerM: 15.88, widthMm: 168.3, thicknessMm: 4.5 },
  { designation: "IS1161 NB 200 × 5.4", family: "IS1161", massKgPerM: 28.46, widthMm: 219.1, thicknessMm: 5.4 },
];

export const sectionFamilies = [
  "ISMB", "ISLB", "ISWB", "ISHB", "ISMC", "ISLC", "ISA", "SHS", "RHS", "IS1161",
] as const;
