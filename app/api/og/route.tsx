import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "Portfolio";
    const description = searchParams.get("description") || "Creative Developer & Designer";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #060606 0%, #111111 50%, #0a0a1a 100%)",
            fontFamily: "system-ui",
          }}
        >
          {/* Gradient glow */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 600,
              height: 600,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(79,70,229,0.15), transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "10%",
              right: "15%",
              width: 300,
              height: 300,
              borderRadius: "50%",
              background: "radial-gradient(circle, rgba(6,182,212,0.1), transparent 70%)",
            }}
          />

          {/* Grid pattern */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.03,
              backgroundImage: "linear-gradient(45deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px 60px",
              zIndex: 10,
            }}
          >
            <div
              style={{
                fontSize: 64,
                fontWeight: 700,
                color: "white",
                textAlign: "center",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                marginBottom: 16,
                maxWidth: 700,
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 24,
                color: "rgba(255,255,255,0.5)",
                textAlign: "center",
                maxWidth: 500,
                lineHeight: 1.4,
              }}
            >
              {description}
            </div>

            {/* Gradient underline */}
            <div
              style={{
                width: 80,
                height: 4,
                borderRadius: 2,
                background: "linear-gradient(90deg, #4F46E5, #06B6D4)",
                marginTop: 24,
              }}
            />
          </div>

          {/* Bottom label */}
          <div
            style={{
              position: "absolute",
              bottom: 40,
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: "rgba(255,255,255,0.15)",
              fontSize: 16,
            }}
          >
            <span>portfolio.dev</span>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(255,255,255,0.2)" }} />
            <span>Alex Chen</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (err) {
    console.error("OG image error:", err);
    return new Response("Failed to generate image", { status: 500 });
  }
}
