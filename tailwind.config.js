/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./**/*.{ts,tsx}",
    "./build/**/*.html",
    "!./node_modules/**",
    "!./.plasmo/**",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Hiragino Sans",
          "Hiragino Kaku Gothic ProN",
          "Noto Sans JP",
          "system-ui",
          "sans-serif",
        ]
      },
    },
  },
  plugins: [],
}
