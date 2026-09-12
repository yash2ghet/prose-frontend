"use client"

import { Editor } from "@tinymce/tinymce-react"

interface RichTextEditorProps {
  value: string
  onChange: (content: string) => void
}

export function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  return (
    <div className="blog-editor">
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
        value={value}
        onEditorChange={onChange}
        init={{
          height: 420,
          menubar: false,
          resize: false,

          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "media",
            "table",
            "preview",
            "wordcount",
          ],

          toolbar:
            "blocks | " +
            "bold italic underline | " +
            "bullist numlist blockquote | " +
            "link image | " +
            "undo redo | " +
            "removeformat | code",

          block_formats:
            "Paragraph=p; Heading 1=h1; Heading 2=h2; Heading 3=h3",

          branding: false,

          content_style: `
            body {
              margin: 0;
              padding: 1.25rem 1.375rem;
              font-family: var(--font-source-serif), Georgia, serif;
              font-size: 1.03125rem;
              line-height: 1.7;
              color: var(--article);
              background: var(--surface);
            }

            p {
              margin: 0 0 1rem;
            }

            h1,
            h2,
            h3 {
              font-family: var(--font-plex-sans), Arial, sans-serif;
              color: var(--text);
              font-weight: 600;
              line-height: 1.3;
            }

            h1 {
              font-size: 2rem;
              margin: 1.5rem 0 0.75rem;
            }

            h2 {
              font-size: 1.375rem;
              margin: 1.5rem 0 0.75rem;
            }

            h3 {
              font-size: 1.063rem;
              margin: 1.25rem 0 0.625rem;
            }

            ul,
            ol {
              margin: 0 0 1rem;
              padding-left: 1.5rem;
            }

            blockquote {
              margin: 1.25rem 0;
              padding-left: 1rem;
              border-left: 0.1875rem solid var(--accent);
              color: var(--text-muted);
              font-style: italic;
            }

            a {
              color: var(--accent-ink);
            }

            pre {
              margin: 1rem 0;
              padding: 1rem;
              overflow-x: auto;
              border-radius: 0.375rem;
              background: var(--surface-alt);
              font-family: var(--font-plex-mono), monospace;
            }

            code {
              font-family: var(--font-plex-mono), monospace;
            }

            img {
              max-width: 100%;
              height: auto;
              border-radius: 0.375rem;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin: 1rem 0;
            }

            th,
            td {
              border: 1px solid var(--border);
              padding: 0.5rem 0.75rem;
              text-align: left;
            }
          `,
        }}
      />

      <div className="border-t border-border bg-surface-alt px-3.5 py-2 font-mono text-caption text-subtle">
        Rich text — content is stored as HTML
      </div>
    </div>
  )
}