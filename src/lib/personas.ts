// Role suggestions and tone archetypes for the AI copywriter.
// The role is now a free-text field — these are just quick-fill chips, not a
// fixed list. The AI adapts to whatever role the user actually types.

export const ROLE_SUGGESTIONS: string[] = [
  "Software Engineer",
  "Product Designer",
  "Marketing Manager",
  "Sales Executive",
  "Data Scientist",
  "Founder / CEO",
  "HR & People Ops",
  "Financial Analyst",
];

// Generic tone/brand archetypes — no longer tied to a specific profession.
export const ARCHETYPES: string[] = [
  "Impact & Results-focused",
  "Visionary & Strategic",
  "Sleek & Minimalist",
  "Warm & Approachable",
  "Bold & Confident",
];

export const DEFAULT_ROLE = "Software Engineer";

export const DEFAULT_ARCHETYPE = ARCHETYPES[0];

// A neutral, fictional example bio (no real personal data — org privacy rule).
export const EXAMPLE_BIO =
  "7+ years building and shipping products end to end. Led cross-functional teams, owned measurable outcomes, and stayed hands-on with the craft. Comfortable across strategy and execution.";
