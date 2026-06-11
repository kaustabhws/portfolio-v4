/**
 * Seed Payload from lib/content.ts (CLI version, macOS/Linux).
 *   npm run seed
 *
 * On Windows the Payload CLI may fail with a tsx path error — use the
 * browser route instead:  /seed?secret=YOUR_PAYLOAD_SECRET
 */
import { seedPayload } from "./seed-core";

seedPayload()
  .then((log) => {
    for (const line of log) console.log(line);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
