export type SteelSection = {
  designation: string;
  family: "ISMB" | "ISWB" | "ISMC" | "ISA";
  massKgPerM: number;
  depthMm?: number;
  widthMm?: number;
  thicknessMm?: number;
};

// Common Indian rolled-section catalogue values. Mass is the authoritative
// input for the standard-section calculator; dimensions are shown for reference.
// Source references: IS 808 tables and published section tables.
export const steelSections: SteelSection[] = [
  { designation: "ISMB 100", family: "ISMB", massKgPerM: 11.5, depthMm: 100, widthMm: 75 },
  { designation: "ISMB 125", family: "ISMB", massKgPerM: 13, depthMm: 125, widthMm: 75 },
  { designation: "ISMB 150", family: "ISMB", massKgPerM: 15.6, depthMm: 150, widthMm: 80 },
  { designation: "ISMB 175", family: "ISMB", massKgPerM: 19, depthMm: 175, widthMm: 90 },
  { designation: "ISMB 200", family: "ISMB", massKgPerM: 22.9, depthMm: 200, widthMm: 100 },
  { designation: "ISMB 225", family: "ISMB", massKgPerM: 27.2, depthMm: 225, widthMm: 110 },
  { designation: "ISMB 250", family: "ISMB", massKgPerM: 37.3, depthMm: 250, widthMm: 125 },
  { designation: "ISMB 300", family: "ISMB", massKgPerM: 44.2, depthMm: 300, widthMm: 140 },
  { designation: "ISMB 350", family: "ISMB", massKgPerM: 52.4, depthMm: 350, widthMm: 140 },
  { designation: "ISMB 400", family: "ISMB", massKgPerM: 61.6, depthMm: 400, widthMm: 140 },
  { designation: "ISMB 450", family: "ISMB", massKgPerM: 72.4, depthMm: 450, widthMm: 150 },
  { designation: "ISMB 500", family: "ISMB", massKgPerM: 86.9, depthMm: 500, widthMm: 180 },
  { designation: "ISMB 550", family: "ISMB", massKgPerM: 103.7, depthMm: 550, widthMm: 190 },
  { designation: "ISMB 600", family: "ISMB", massKgPerM: 122.6, depthMm: 600, widthMm: 210 },

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

  { designation: "ISMC 75", family: "ISMC", massKgPerM: 6.8, depthMm: 75, widthMm: 40 },
  { designation: "ISMC 100", family: "ISMC", massKgPerM: 9.2, depthMm: 100, widthMm: 50 },
  { designation: "ISMC 125", family: "ISMC", massKgPerM: 12.7, depthMm: 125, widthMm: 65 },
  { designation: "ISMC 150", family: "ISMC", massKgPerM: 16.4, depthMm: 150, widthMm: 75 },
  { designation: "ISMC 175", family: "ISMC", massKgPerM: 19.1, depthMm: 175, widthMm: 75 },
  { designation: "ISMC 200", family: "ISMC", massKgPerM: 22.1, depthMm: 200, widthMm: 75 },
  { designation: "ISMC 250", family: "ISMC", massKgPerM: 30.4, depthMm: 250, widthMm: 80 },
  { designation: "ISMC 300", family: "ISMC", massKgPerM: 36.3, depthMm: 300, widthMm: 90 },
  { designation: "ISMC 400", family: "ISMC", massKgPerM: 49.4, depthMm: 400, widthMm: 100 },

  { designation: "ISA 40×40×5", family: "ISA", massKgPerM: 3, widthMm: 40, thicknessMm: 5 },
  { designation: "ISA 50×50×5", family: "ISA", massKgPerM: 3.8, widthMm: 50, thicknessMm: 5 },
  { designation: "ISA 50×50×6", family: "ISA", massKgPerM: 4.5, widthMm: 50, thicknessMm: 6 },
  { designation: "ISA 65×65×6", family: "ISA", massKgPerM: 5.8, widthMm: 65, thicknessMm: 6 },
  { designation: "ISA 65×65×8", family: "ISA", massKgPerM: 7.7, widthMm: 65, thicknessMm: 8 },
  { designation: "ISA 75×75×6", family: "ISA", massKgPerM: 6.8, widthMm: 75, thicknessMm: 6 },
  { designation: "ISA 75×75×8", family: "ISA", massKgPerM: 8.9, widthMm: 75, thicknessMm: 8 },
  { designation: "ISA 90×90×8", family: "ISA", massKgPerM: 10.8, widthMm: 90, thicknessMm: 8 },
  { designation: "ISA 90×90×10", family: "ISA", massKgPerM: 13.4, widthMm: 90, thicknessMm: 10 },
  { designation: "ISA 100×100×8", family: "ISA", massKgPerM: 12.1, widthMm: 100, thicknessMm: 8 },
  { designation: "ISA 100×100×10", family: "ISA", massKgPerM: 14.9, widthMm: 100, thicknessMm: 10 },
  { designation: "ISA 110×110×10", family: "ISA", massKgPerM: 16.6, widthMm: 110, thicknessMm: 10 },
  { designation: "ISA 130×130×10", family: "ISA", massKgPerM: 19.7, widthMm: 130, thicknessMm: 10 },
  { designation: "ISA 150×150×12", family: "ISA", massKgPerM: 27.2, widthMm: 150, thicknessMm: 12 },
];

export const sectionFamilies = ["ISMB", "ISWB", "ISMC", "ISA"] as const;
