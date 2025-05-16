/* eslint-disable */
import { mount } from "@cypress/react";

// Make `mount` available globally

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add("mount", mount);

// Alternatively export mount for direct import
export { mount };
