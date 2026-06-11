import path from "path";
import { fileURLToPath } from "url";

import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import sharp from "sharp";

import { Users } from "./payload/collections/Users";
import { Media } from "./payload/collections/Media";
import { Projects } from "./payload/collections/Projects";
import { Education } from "./payload/collections/Education";
import { Services } from "./payload/collections/Services";
import { SkillGroups } from "./payload/collections/SkillGroups";
import { Profile } from "./payload/globals/Profile";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

// Cloudflare R2 (S3-compatible) object storage for uploads.
// Only enabled when the R2 env vars are present — otherwise Payload
// falls back to local-disk storage (fine for local dev).
const r2Enabled = Boolean(
  process.env.R2_BUCKET &&
    process.env.R2_ENDPOINT &&
    process.env.R2_ACCESS_KEY_ID &&
    process.env.R2_SECRET_ACCESS_KEY,
);

const storagePlugins = r2Enabled
  ? [
      s3Storage({
        collections: { media: true },
        bucket: process.env.R2_BUCKET as string,
        config: {
          endpoint: process.env.R2_ENDPOINT,
          region: "auto",
          forcePathStyle: true,
          credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
          },
        },
      }),
    ]
  : [];

const emailConfigured = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
const smtpPort = Number(process.env.SMTP_PORT) || 465;

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      title: "Portfolio CMS",
      titleSuffix: " · Portfolio",
    },
  },
  collections: [Users, Media, Projects, Education, Services, SkillGroups],
  globals: [Profile],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
    },
  }),
  plugins: storagePlugins,
  ...(emailConfigured
    ? {
        email: nodemailerAdapter({
          defaultFromName: "Portfolio",
          defaultFromAddress: process.env.SMTP_USER as string,
          transportOptions: {
            host: process.env.SMTP_HOST || "smtp.gmail.com",
            port: smtpPort,
            secure: smtpPort === 465,
            auth: {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            },
          },
        }),
      }
    : {}),
  sharp,
});
