/**
 * @file apps/web/src/app/apple-icon.tsx
 * @description Dynamic Apple Touch Icon for QuantAI.
 */

// eslint-disable-next-line react-refresh/only-export-components
export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

/**
 * Generates Apple Touch Icon representation using exact Lucide TrendingUp icon with brand primary #06b6d4.
 *
 * @returns JSX Element describing the mobile icon frame.
 */
export default function Icon() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#080c14",
        borderRadius: "36px",
        border: "2px solid rgba(6, 182, 212, 0.4)",
      }}
    >
      <svg
        width="108"
        height="108"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#06b6d4"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
        <polyline points="16 7 22 7 22 13" />
      </svg>
    </div>
  );
}
