import type { Field } from "payload";

/** Shared accent-colour selector used across collections. */
export const accentField: Field = {
  name: "accent",
  type: "select",
  defaultValue: "cyan",
  options: [
    { label: "Cyan", value: "cyan" },
    { label: "Magenta", value: "magenta" },
    { label: "Yellow", value: "yellow" },
  ],
};
