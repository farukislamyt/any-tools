# AnyTools Calculation Audit & Implementation Plan

Date: 2026-09-06

## Audit scope

Reviewed the current calculation surface, calculation engine, standard-section data model, unit conversion, UI input handling, and project test/build setup.

Current published tools:

- Basic Calculator
- Metal Weight Calculator

The homepage registry intentionally contains only routes that currently exist.

## Findings

### P0 — fixed in this audit

1. **Octagon area formula was incorrect.**
   - The UI labels the input as across-flats.
   - The previous formula treated the value incorrectly and overstated area by about 5.828×.
   - It is now calculated as `F² / (2 × (1 + √2))`, where `F` is across-flats.

2. **Impossible hollow-section dimensions were silently accepted.**
   - Pipe/tube walls at or above half the outside dimension could collapse the inner void and accidentally return a solid-section area.
   - Geometry validation now rejects impossible pipe/tube dimensions.

3. **Invalid structural-section dimensions could produce misleading areas.**
   - Validation now checks positive dimensions and basic relationships such as `2 × flangeThickness < depth` and `webThickness <= flangeWidth`.

4. **Quantity handling was previously forced to at least one piece.**
   - The engine now returns zero pieces for zero/invalid quantities instead of silently converting invalid input to one piece.

5. **No calculation regression tests existed.**
   - Vitest was added with unit tests covering units, basic shapes, octagon/hex geometry, hollow-section validation, structural-section validation, weight conversion, quantity handling and invalid inputs.

## P1 — next implementation priority

### Basic Calculator

Audit and test:

- addition, subtraction, multiplication and division
- decimal input and duplicate decimal prevention
- repeated operators
- operator replacement
- chained calculations
- divide-by-zero behavior
- very large/small values
- negative results
- rounding policy

Decision: divide-by-zero should show an explicit calculation error rather than silently returning zero.

### Metal Weight engine

Add table-driven tests for every supported shape:

- round
- wire
- square
- rectangle
- flat
- plate
- hex
- octagon
- pipe
- tube
- angle
- channel
- I-beam
- H-beam
- tee
- Z-section

Important distinction: custom structural-section formulas are **idealized geometric approximations**. They should not be presented as exact catalogue mass where fillets, slopes, corner radii, tapers or rolling tolerances materially change the section.

### Unit system

Build a single tested conversion layer for:

- length
- area
- volume
- mass
- density
- force
- pressure
- torque
- energy
- power

Do not duplicate conversion constants inside individual tools.

## Standard-section data audit

The current `steel-sections.ts` contains representative catalogue values and explicitly tells users to verify applicable standards/mill data before procurement, fabrication or structural design.

This must remain a hard product rule until each dataset is independently verified.

For Indian steel products, standards should be checked against current BIS material. BIS currently lists IS 4923:2017 for hollow steel sections and IS 1161:2014 for structural steel tubes; BIS material also identifies dimensional, mass and testing requirements for these products. citeturn0search0turn0search34

Before expanding the catalogue:

1. identify the exact standard revision
2. capture designation, dimensions, mass and tolerances from an authoritative source
3. store source/standard metadata with the dataset
4. add regression tests for representative rows
5. never infer catalogue mass solely from nominal dimensions when a standard table provides mass

## P2 — reusable calculation architecture

Move toward this structure:

```text
Tool metadata
  -> validated inputs
  -> normalized SI/base units
  -> pure calculation engine
  -> result model
  -> formatted output
  -> formula / assumptions
```

Calculation functions should remain pure and independent from React UI components. This allows the same engine to power the web page, future API endpoints, embeds and automated tests.

Recommended shared modules:

- `lib/units.ts`
- `lib/validation.ts`
- `lib/calculations/metal-weight.ts`
- `lib/calculations/percentage.ts`
- `lib/calculations/concrete.ts`
- `lib/calculations/rebar.ts`
- `lib/calculations/finance.ts`

## Tool expansion roadmap

### Phase 1 — reliability foundation

- Basic Calculator audit/fix
- Metal Weight audit/fix
- unit-conversion test suite
- CI typecheck/test/lint/build
- calculation error states
- input validation and boundary tests

### Phase 2 — highest-value engineering tools

1. Rebar Weight Calculator
2. Pipe Weight Calculator
3. Plate Weight Calculator
4. Tube/SHS/RHS Weight Calculator
5. Concrete Volume Calculator
6. Cement/Concrete Material Calculator
7. Brick Calculator
8. Sand/Aggregate Calculator
9. Excavation Volume Calculator
10. Area/Volume/Length converters

### Phase 3 — general-purpose calculators

1. Percentage Calculator
2. Ratio Calculator
3. Fraction Calculator
4. Average Calculator
5. Discount Calculator
6. Profit & Loss Calculator
7. Age Calculator
8. Date Difference Calculator

### Phase 4 — structural engineering

1. Section Properties Calculator
2. Moment of Inertia Calculator
3. Section Modulus Calculator
4. Bending Stress Calculator
5. Shear Stress Calculator
6. Simply Supported Beam Calculator
7. Cantilever Beam Calculator
8. Beam Deflection Calculator

These must clearly state assumptions, load cases, units, boundary conditions and design-code limitations. They are engineering aids, not substitutes for a qualified engineer's design verification.

### Phase 5 — finance and mechanical

Finance:

- EMI
- loan payment
- simple interest
- compound interest
- VAT
- salary
- investment return

Mechanical:

- RPM
- gear ratio
- torque
- power
- pulley ratio
- belt length
- shaft diameter
- hydraulic force
- pump flow

## Quality gates for every new calculator

A calculator is not considered production-ready until it has:

- a pure calculation function
- explicit units
- input validation
- at least 5 normal-case tests
- boundary/invalid-input tests
- one independently calculated reference case
- documented formula
- documented assumptions
- responsive UI
- unique SEO metadata
- accessible labels and keyboard operation
- no route in the registry before its page exists

## CI

`.github/workflows/ci.yml` now runs:

1. dependency installation
2. TypeScript typecheck
3. unit tests
4. ESLint
5. production build

The repository currently has no previously verified production build result in this audit; the new CI workflow is the mechanism that should establish that baseline after GitHub Actions runs.

## Recommended implementation order

**Now:** fix calculator error handling and complete metal-weight table tests.

**Next:** centralize units and validation, then build Rebar + Pipe + Plate + Concrete calculators.

**Then:** add general calculators and SEO pages.

**Later:** structural engineering tools after the calculation/test framework is mature.

This order maximizes reuse while minimizing the risk of multiplying incorrect formulas across many tools.
