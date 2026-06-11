import type { CollectionConfig } from "payload";
import { accentField } from "../fields";

export const Education: CollectionConfig = {
  slug: "education",
  access: { read: () => true },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "org", "period", "order"],
  },
  defaultSort: "order",
  fields: [
    { name: "period", type: "text" },
    { name: "title", type: "text", required: true },
    { name: "org", type: "text" },
    { name: "description", type: "textarea" },
    accentField,
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { description: "Lower numbers appear first (top of the timeline)." },
    },
  ],
};
