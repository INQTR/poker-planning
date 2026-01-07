import { ImageResponse } from "next/og";
import { getPostBySlug } from "../posts";

export const alt = "AgileKit Blog";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  const title = post?.title || "AgileKit Blog";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          backgroundColor: "#0a0a0a",
          padding: "60px",
        }}
      >
        {/* Background gradient */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(0, 0, 0, 0) 50%, rgba(168, 85, 247, 0.1) 100%)",
          }}
        />

        {/* Top bar with logo */}
        <div
          style={{
            position: "absolute",
            top: "60px",
            left: "60px",
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {/* Logo icon */}
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M12 8v8" />
              <path d="M8 12h8" />
            </svg>
          </div>
          <span
            style={{
              fontSize: "28px",
              fontWeight: "600",
              color: "#ffffff",
              letterSpacing: "-0.02em",
            }}
          >
            AgileKit
          </span>
          <span
            style={{
              fontSize: "28px",
              color: "#6b7280",
              marginLeft: "8px",
            }}
          >
            Blog
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            maxWidth: "900px",
          }}
        >
          <h1
            style={{
              fontSize: title.length > 60 ? "48px" : "56px",
              fontWeight: "700",
              color: "#ffffff",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              margin: 0,
            }}
          >
            {title}
          </h1>
          {post?.spoiler && (
            <p
              style={{
                fontSize: "24px",
                color: "#9ca3af",
                lineHeight: 1.4,
                margin: 0,
                maxWidth: "800px",
              }}
            >
              {post.spoiler.length > 120
                ? post.spoiler.slice(0, 120) + "..."
                : post.spoiler}
            </p>
          )}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            right: "60px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "#6b7280",
            fontSize: "20px",
          }}
        >
          <span>agilekit.app/blog</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
