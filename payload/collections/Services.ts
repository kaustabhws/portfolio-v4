import type { CollectionConfig } from "payload";
import { accentField } from "../fields";

export const Services: CollectionConfig = {
  slug: "services",
  access: { read: () => true },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "index", "order"],
  },
  defaultSort: "order",
  fields: [
    { name: "index", type: "text", admin: { description: 'e.g. "01"' } },
    { name: "title", type: "text", required: true },
    { name: "description", type: "textarea" },
    {
      name: "deliverables",
      type: "array",
      labels: { singular: "Deliverable", plural: "Deliverables" },
      fields: [{ name: "item", type: "text" }],
    },
    accentField,
    { name: "order", type: "number", defaultValue: 0 },
  ],
};
