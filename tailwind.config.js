/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./popup.tsx",
    "./build/chrome-mv3-dev/**/*.html"
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
