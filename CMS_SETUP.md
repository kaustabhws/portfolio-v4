# Portfolio CMS (Payload 3 + Neon Postgres)

Your content is now managed by **Payload CMS**, embedded in this same Next.js app.
Edit at `/admin`, and changes appear on the site immediately (the homepage is
server-rendered per request).

## Log in

- **Admin panel:** http://localhost:3000/admin
- **Seeded login:** `admin@example.com` / `changeme123`  ← **change this immediately**
  (Admin → your user → change email & password.)

## What's where

| Content | Edit in admin | Defined by |
| --- | --- | --- |
| Name, role, hero copy, socials, stats, marquee, portrait | **Globals → Profile** | `payload/globals/Profile.ts` |
| Projects | **Collections → Projects** | `payload/collections/Projects.ts` |
| Experience / education timeline | **Collections → Education** | `payload/collections/Education.ts` |
| Services | **Collections → Services** | `payload/collections/Services.ts` |
| Skills | **Collections → Skill Groups** | `payload/collections/SkillGroups.ts` |
| Images | **Collections → Media** | `payload/collections/Media.ts` |

Use the **`order`** field to control ordering. Accent colours are cyan / magenta / yellow.

## Architecture notes

- The frontend lives in `app/(frontend)/`, the CMS in `app/(payload)/` (two root layouts).
- `lib/data.ts` reads everything from Payload and **falls back to `lib/content.ts`**
  if the DB is empty or unreachable — so the site never breaks.
- Images: until you upload your own in **Media** and attach them, projects and the
  About portrait use the placeholder images from `lib/content.ts`.

## Re-seeding (already done once)

Content was seeded from `lib/content.ts`. The seed is idempotent (collections are
only filled when empty). To run it again:

- **Browser (Windows-friendly):** `GET /seed?secret=YOUR_PAYLOAD_SECRET`
- **CLI (macOS/Linux):** `npm run seed`

> On Windows the Payload CLI (`npm run seed`, `generate:types`) can fail with a `tsx`
> path error — use the browser route instead.

## Image uploads & storage (Cloudflare R2)

Uploads (project images, the About portrait, anything in **Media**) are stored in
**Cloudflare R2** when the `R2_*` env vars are set. If they're blank, Payload falls
back to local-disk storage (fine for local dev, but **not** for Vercel — its
filesystem is ephemeral).

Files are served back through Payload's own `/api/media/file/...` route (same
origin), so `next/image` works with no extra config and the **bucket can stay
private**.

### One-time R2 setup

1. Cloudflare dashboard → **R2** → **Create bucket** (e.g. `portfolio-media`).
2. **R2 → Manage R2 API Tokens → Create API Token** with **Object Read & Write**.
   Copy the **Access Key ID** and **Secret Access Key**.
3. Find your **Account ID** (R2 overview page). Your endpoint is:
   `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`
4. Fill these into `.env` (and your Vercel project env vars):
   ```
   R2_BUCKET=portfolio-media
   R2_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
   R2_ACCESS_KEY_ID=...
   R2_SECRET_ACCESS_KEY=...
   ```
5. Restart the dev server. Upload an image on a Project in `/admin` → it now lands
   in R2 and shows on the site.

> **Optional (faster serving):** attach a public custom domain (or enable the
> `r2.dev` URL) to the bucket and serve images directly from R2 instead of
> through Payload. If you do, add that hostname to `remotePatterns` in
> `next.config.ts`.

## Contact form email (Nodemailer)

The contact form sends real email via SMTP. When you submit it:

1. **You get a notification** (with the visitor set as reply-to, so you can just
   hit reply), and
2. **the visitor gets a branded auto-reply** confirming you received it.

Both are dark, on-brand HTML emails (templates in `lib/mailer.ts`).

### Setup (Gmail example)

1. Enable **2-Step Verification** on your Google account.
2. Google Account → Security → **App passwords** → create one (16 characters).
3. Fill `.env`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=465
   SMTP_USER=you@gmail.com
   SMTP_PASS=your-16-char-app-password   # NOT your normal password
   CONTACT_TO=you@gmail.com              # optional; defaults to SMTP_USER
   ```
4. Restart the dev server. Submit the form → check your inbox.

> Other providers: set `SMTP_HOST`/`SMTP_PORT` to theirs (587 uses STARTTLS, 465
> uses SSL — the code picks the right mode automatically).

Until SMTP is set, the form returns a friendly "Email isn't set up yet" message
instead of erroring. The same SMTP config also powers Payload's admin emails
(e.g. password resets) and silences the earlier "No email adapter" warning.

Spam protection: a hidden honeypot field silently drops bots; inputs are
length-capped and HTML-escaped in the emails.

## ⚠️ Before deploying

1. ~~Change `PAYLOAD_SECRET`~~ ✅ done.
2. **Change the admin password** (and ideally the email).
3. **Delete `app/seed/route.ts`** once you no longer need it.
4. On Vercel, set `DATABASE_URI`, `PAYLOAD_SECRET`, the four `R2_*` variables,
   and the `SMTP_*` (+ `CONTACT_TO`) variables.
   Postgres schema changes in production use migrations — see Payload's
   "Migrations" docs (`payload migrate:create` / `payload migrate`).

## Environment variables

```
DATABASE_URI   = your Neon pooled connection string (?sslmode=require)
PAYLOAD_SECRET = long random string used to sign tokens
```
