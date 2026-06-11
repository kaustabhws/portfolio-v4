// sharp 0.35's package.json "exports" doesn't surface its types under
// TypeScript's "bundler" module resolution. It's only passed through to
// Payload's buildConfig, so an ambient declaration is sufficient.
declare module "sharp";
