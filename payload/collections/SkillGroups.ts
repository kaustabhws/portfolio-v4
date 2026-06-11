import type { CollectionConfig } from "payload";
import { accentField } from "../fields";

export const SkillGroups: CollectionConfig = {
  slug: "skill-groups",
  access: { read: () => true },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "order"],
  },
  defaultSort: "order",
  fields: [
    { name: "title", type: "text", required: true },
    accentField,
    {
      name: "items",
      type: "array",
      labels: { singular: "Skill", plural: "Skills" },
      fields: [
        { name: "name", type: "text", required: true },
        {
          name: "level",
          type: "number",
          min: 0,
          max: 100,
          defaultValue: 80,
          admin: { description: "Proficiency 0–100 (drives the bar width)." },
        },
      ],
    },
    { name: "order", type: "number", defaultValue: 0 },
  ],
};
