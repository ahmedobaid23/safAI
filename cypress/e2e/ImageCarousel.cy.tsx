import React from "react";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import sinon from "sinon";
import ImageCarousel from "../../components/gallery/image-carousel";

// Mock router that actually redirects to your real dashboard route
describe("ImageCarousel Integration Test with real dashboard", () => {
  let mockAppRouter: MockAppRouter;

  interface MockAppRouter {
    push: sinon.SinonStub;
    replace: sinon.SinonStub;
    refresh: sinon.SinonStub;
    back: sinon.SinonStub;
    forward: sinon.SinonStub;
    prefetch: sinon.SinonStub;
  }

  beforeEach(() => {
    mockAppRouter = {
      push: sinon.stub().callsFake((url: string) => {
        if (url === "/dashboard") {
          cy.visit("/dashboard");
        }
      }),
      replace: sinon.stub(),
      refresh: sinon.stub(),
      back: sinon.stub(),
      forward: sinon.stub(),
      prefetch: sinon.stub().resolves(),
    };

    // Clear localStorage before each test
    cy.window().then((win) => win.localStorage.clear());
  });

  it("saves selected image URL to localStorage and renders it correctly on /dashboard", () => {
    const testImage = ["/test.png"];

    cy.mount(
      <AppRouterContext.Provider value={mockAppRouter}>
        <ImageCarousel images={testImage} />
      </AppRouterContext.Provider>
    );

    // Click "Use this Image" button
    cy.contains("Use this Image").click({ force: true });

    // Confirm localStorage has a value that includes "test2.png"
    cy.window().then((win) => {
      const stored = win.localStorage.getItem("galleryImage");
      expect(stored).to.contain("test.png");
    });

    // Wait for navigation and check if dashboard page has loaded
    cy.url().should("include", "/dashboard");

    // Check that the rendered image on dashboard contains "test2.png"
    cy.get("img")
      .should("be.visible")
      .should("have.attr", "src")
      .and("include", "test.png");
  });
});
