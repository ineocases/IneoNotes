/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6750A4",
        ink: "#1A1B20",
        paper: "#F8F9FC"
      }
    }
  },
  plugins: []
};