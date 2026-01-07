import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import Image from "next/image";
import type { ComponentProps, HTMLAttributes } from "react";

// Wrapper for code blocks with syntax highlighting (handled by rehype-pretty-code)
function Pre({ children, ...props }: HTMLAttributes<HTMLPreElement>) {
  return (
    <pre
      className="overflow-x-auto rounded-lg border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 p-4 text-sm my-6"
      {...props}
    >
      {children}
    </pre>
  );
}

function Code({
  children,
  ...props
}: HTMLAttributes<HTMLElement> & { "data-language"?: string }) {
  // Inline code (not in a pre block)
  const isInline = !props["data-language"];
  if (isInline) {
    return (
      <code
        className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-zinc-800 text-sm font-mono text-primary"
        {...props}
      >
        {children}
      </code>
    );
  }
  // Code inside pre block (handled by rehype-pretty-code)
  return <code {...props}>{children}</code>;
}

function Anchor({
  href,
  children,
  ...props
}: ComponentProps<"a"> & { href?: string }) {
  if (href?.startsWith("/")) {
    return (
      <Link
        href={href}
        className="text-primary underline underline-offset-4 hover:text-primary/80"
        {...props}
      >
        {children}
      </Link>
    );
  }
  if (href?.startsWith("#")) {
    return (
      <a
        href={href}
        className="text-primary underline underline-offset-4 hover:text-primary/80"
        {...props}
      >
        {children}
      </a>
    );
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline underline-offset-4 hover:text-primary/80"
      {...props}
    >
      {children}
    </a>
  );
}

function Img({
  src,
  alt,
  ...props
}: ComponentProps<"img"> & { src?: string; alt?: string }) {
  if (!src) return null;

  // For local images in the blog post directory
  if (src.startsWith("./") || (!src.startsWith("http") && !src.startsWith("/"))) {
    return (
      <span className="block my-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt || ""}
          className="rounded-lg max-w-full h-auto mx-auto"
          {...props}
        />
      </span>
    );
  }

  // For external images or absolute paths
  return (
    <span className="block my-6">
      <Image
        src={src}
        alt={alt || ""}
        width={800}
        height={450}
        className="rounded-lg max-w-full h-auto mx-auto"
      />
    </span>
  );
}

function Blockquote({ children, ...props }: HTMLAttributes<HTMLQuoteElement>) {
  return (
    <blockquote
      className="border-l-4 border-primary pl-4 italic text-muted-foreground my-6"
      {...props}
    >
      {children}
    </blockquote>
  );
}

function Table({ children, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto my-6">
      <table
        className="w-full border-collapse text-sm"
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

function Th({ children, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className="border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 px-4 py-2 text-left font-semibold"
      {...props}
    >
      {children}
    </th>
  );
}

function Td({ children, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className="border border-gray-200 dark:border-zinc-700 px-4 py-2"
      {...props}
    >
      {children}
    </td>
  );
}

export const mdxComponents: MDXComponents = {
  // Headings with anchor links (handled by rehype-slug and rehype-autolink-headings)
  h1: ({ children, ...props }) => (
    <h1
      className="text-3xl font-bold mt-10 mb-4 scroll-mt-24"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2
      className="text-2xl font-semibold mt-10 mb-4 scroll-mt-24 border-b border-gray-200 dark:border-zinc-800 pb-2"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3
      className="text-xl font-semibold mt-8 mb-3 scroll-mt-24"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4
      className="text-lg font-semibold mt-6 mb-2 scroll-mt-24"
      {...props}
    >
      {children}
    </h4>
  ),

  // Paragraphs
  p: ({ children, ...props }) => (
    <p className="leading-7 my-4" {...props}>
      {children}
    </p>
  ),

  // Lists
  ul: ({ children, ...props }) => (
    <ul className="list-disc pl-6 my-4 space-y-2" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal pl-6 my-4 space-y-2" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-7" {...props}>
      {children}
    </li>
  ),

  // Code
  pre: Pre,
  code: Code,

  // Links
  a: Anchor,

  // Images
  img: Img,

  // Blockquotes
  blockquote: Blockquote,

  // Tables
  table: Table,
  th: Th,
  td: Td,

  // Horizontal rule
  hr: (props) => (
    <hr className="my-8 border-gray-200 dark:border-zinc-800" {...props} />
  ),

  // Strong/Bold
  strong: ({ children, ...props }) => (
    <strong className="font-semibold" {...props}>
      {children}
    </strong>
  ),

  // Emphasis/Italic
  em: ({ children, ...props }) => (
    <em className="italic" {...props}>
      {children}
    </em>
  ),
};
