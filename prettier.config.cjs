/** @type {import("prettier").Config} */
const config = {
  plugins: [require.resolve("prettier-plugin-tailwindcss")],
  singleAttributePerLine: true,
  semi: true,
};

module.exports = config;
