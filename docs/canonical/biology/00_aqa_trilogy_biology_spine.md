# AQA Trilogy Biology spine

Purpose: keep Biology course content aligned to AQA Combined Science: Trilogy 8464, rather than drifting into mixed-topic or Triple-only sequencing.

## Source of truth

AQA Combined Science: Trilogy Biology content order:

1. Cell biology
2. Organisation
3. Infection and response
4. Bioenergetics
5. Homeostasis and response
6. Inheritance, variation and evolution
7. Ecology

## App chapter sequence recommendation

The app should not treat these as seven giant chapters. Each AQA topic should be split into smaller mobile-first learning chapters.

### Topic 1: Cell biology

1. **Building blocks**  
   Animal, plant and bacterial cell structures; eukaryotic vs prokaryotic cells.

2. **Seeing cells and making new cells**  
   Microscopes, magnification, cell scale, chromosomes, mitosis and stem cells.

3. **Moving in and out of cells**  
   Diffusion, osmosis, active transport, exchange surfaces and osmosis required practical.

### Topic 2: Organisation

4. **Cells to systems**  
   Cell/tissue/organ/organ-system hierarchy and digestive system overview.

5. **Enzymes and digestion**  
   Enzyme action, temperature/pH, denaturation, digestive enzymes, bile, food tests required practical, amylase practical.

6. **Heart, blood and health risks**  
   Heart, double circulation, blood vessels, blood components, coronary heart disease, treatments, lifestyle risk factors, cancer.

7. **Plant transport systems**  
   Plant tissues, xylem, phloem, stomata, transpiration, translocation and factors affecting transpiration.

### Topic 3: Infection and response

8. **Pathogens and disease**  
   Types of pathogen, transmission, viral/bacterial/fungal/protist diseases.

9. **Defence, vaccination and treatment**  
   Non-specific defences, immune system, vaccination, antibiotics, painkillers, drug discovery and testing.

### Topic 4: Bioenergetics

10. **Photosynthesis**  
   Equation, chlorophyll/chloroplasts, limiting factors, glucose uses, required practical.

11. **Respiration and exercise**  
   Aerobic respiration, anaerobic respiration, exercise response, oxygen debt, metabolism.

### Topic 5: Homeostasis and response

12. **Nerves and reflexes**
13. **Hormones and blood glucose**
14. **Reproduction and fertility**

### Topic 6: Inheritance, variation and evolution

15. **Reproduction, meiosis and DNA**
16. **Inheritance and genetic disorders**
17. **Variation, evolution and classification**

### Topic 7: Ecology

18. **Communities and ecosystems**
19. **Cycles, biodiversity and human impact**

## Immediate cleanup needed

Current source has a duplicated chapter number 2:

- `sci_bio_w1` — Plant Cells & Photosynthesis
- `bio_building_life` — Building Life: Cells, Microscopes & Division

Fix:

- Move `sci_bio_w1` to the Bioenergetics section later in the sequence.
- Use `bio_building_life` as Chapter 2 and replace its placeholder screen with the full canonical content in `02_seeing_cells_and_making_new_cells.md`.
- Use a new or renamed Chapter 3 module for `03_moving_in_and_out_of_cells.md`.

## Combined Science guardrail

This course is AQA Combined Science: Trilogy. Do not include Triple-only material in the main path unless it is explicitly tagged as extension/not required for Trilogy.
