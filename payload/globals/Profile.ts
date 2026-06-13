import type { GlobalConfig } from "payload";

export const Profile: GlobalConfig = {
  slug: "profile",
  access: { read: () => true },
  admin: { description: "Your identity, hero copy, stats, socials and marquee." },
  fields: [
    {
      type: "row",
      fields: [
        { name: "firstName", type: "text", required: true, admin: { width: "50%" } },
        { name: "lastName", type: "text", required: true, admin: { width: "50%" } },
      ],
    },
    { name: "name", type: "text", admin: { description: "Full display name (e.g. for the footer)." } },
    { name: "role", type: "text" },
    { name: "tagline", type: "text" },
    { name: "location", type: "text" },
    { name: "email", type: "email" },
    { name: "available", type: "checkbox", defaultValue: true },
    { name: "blurb", type: "textarea" },
    {
      name: "portrait",
      type: "upload",
      relationTo: "media",
      admin: { description: "About-section portrait. Falls back to a placeholder if empty." },
    },
    {
      name: "socials",
      type: "array",
      labels: { singular: "Social link", plural: "Social links" },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "href", type: "text" },
      ],
    },
    {
      name: "stats",
      type: "array",
      labels: { singular: "Stat", plural: "Stats" },
      fields: [
        { name: "value", type: "text", required: true },
        { name: "label", type: "text", required: true },
      ],
    },
    {
      name: "marquee",
      type: "array",
      labels: { singular: "Marquee item", plural: "Marquee items" },
      fields: [{ name: "skill", type: "text", required: true }],
    },
  ],
};
