# Component execution contracts

One page per content display type: what the bar is (a named example from
the codebase and why it works), the copy standards, and the known failure
modes. Consumed by the content-create and content-review skills and the
Workflow C/E critique gate.

A contract governs *execution quality* — it never redefines the
component's API or overrides a LOCKED component's internals.

Contracts so far: read-blocks, theory-lab, matching-task,
key-figure-reveal, interactive-hotspot-image, quick-recall. When content
work repeatedly hits quality problems on an uncontracted component, write
its contract as part of that work (Lane G change).
