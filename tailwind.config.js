import remToPxPlugin from "tailwindcss-rem-to-px";

module.exports = {
  mode: "jit",
  content: ["./**/*.{json,liquid}"],
  theme: {
    extend: {},
  },
  plugins: [
    remToPxPlugin({
      baseFontSize: 16,
    }),
  ],
};
