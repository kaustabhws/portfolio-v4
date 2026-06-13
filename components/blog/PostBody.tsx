import { RichText } from "@payloadcms/richtext-lexical/react";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

type UploadValue = {
  url?: string;
  alt?: string;
  width?: number;
  height?: number;
};

/** Renders Payload's Lexical content as styled article HTML. */
export default function PostBody({ content }: { content: unknown }) {
  if (!content) return null;
  return (
    <div className="prose-blog">
      <RichText
        data={content as SerializedEditorState}
        converters={({ defaultConverters }) => ({
          ...defaultConverters,
          // Render images embedded between paragraphs. Media is served
          // same-origin via /api/media/file/..., so a plain <img> is enough
          // (no next/image remotePatterns config needed).
          upload: ({ node }) => {
            const value = (node as { value?: UploadValue }).value;
            if (!value || typeof value !== "object" || !value.url) return null;
            return (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value.url}
                alt={value.alt ?? ""}
                width={value.width}
                height={value.height}
                loading="lazy"
              />
            );
          },
        })}
      />
    </div>
  );
}
