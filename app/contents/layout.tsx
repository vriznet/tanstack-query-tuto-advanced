import Link from "next/link";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div
        className="home-button"
        style={{
          padding: "8px 16px",
          borderRadius: "4px",
          border: "1px solid #ddd",
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "16px",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 12L6 8L10 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <Link
          href="/"
          style={{
            textDecoration: "none",
            color: "black",
            transform: "translateY(2px)",
          }}
        >
          HOME
        </Link>
      </div>
      {children}
    </>
  );
}
