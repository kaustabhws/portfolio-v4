import type { CollectionConfig } from "payload";
import { accentField } from "../fields";

export const Projects: CollectionConfig = {
  slug: "projects",
  access: { read: () => true },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "category", "year", "featured", "order"],
  },
  defaultSort: "order",
  fields: [
    { name: "title", type: "text", required: true },
    { name: "category", type: "text" },
    { name: "year", type: "text" },
    { name: "description", type: "textarea" },
    {
      name: "tags",
      type: "array",
      labels: { singular: "Tag", plural: "Tags" },
      fields: [{ name: "tag", type: "text" }],
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      admin: { description: "Upload a project image. Falls back to a placeholder if empty." },
    },
    accentField,
    { name: "href", type: "text", defaultValue: "#" },
    { name: "featured", type: "checkbox", defaultValue: false },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { description: "Lower numbers appear first." },
    },
  ],
};
