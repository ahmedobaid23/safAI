import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack", // or 'vite' if you use vite
    },
    indexHtmlFile: "cypress/support/component-index.html",
    supportFile: "cypress/support/component.ts",
    specPattern: ["cypress/component/**/*.cy.{js,jsx,ts,tsx}"],
  },

  e2e: {
    setupNodeEvents() {
      // implement node event listeners here
    },
  },
});
