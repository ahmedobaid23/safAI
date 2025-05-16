import React from "react";
import UploadImage from "../../components/dashboard/upload-image";
import { mount } from "cypress/react";
import "cypress-file-upload";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Toaster } from "sonner";
import sinon from "sinon";

describe("UploadImage component only accepts image file uploads.", () => {
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
      push: sinon.stub(),
      replace: sinon.stub(),
      refresh: sinon.stub(),
      back: sinon.stub(),
      forward: sinon.stub(),
      prefetch: sinon.stub().resolves(),
    };
  });

  it("rejects txt file uploads", () => {
    mount(
      <AppRouterContext.Provider value={mockAppRouter}>
        <Toaster />
        <UploadImage />
      </AppRouterContext.Provider>
    );

    cy.get('input[type="file"]').attachFile("Test.txt");

    cy.contains(/Please upload an image file/i, { timeout: 6000 }).should(
      "be.visible"
    );
  });

  it("rejects docx file uploads", () => {
    mount(
      <AppRouterContext.Provider value={mockAppRouter}>
        <Toaster />
        <UploadImage />
      </AppRouterContext.Provider>
    );

    cy.get('input[type="file"]').attachFile("test.docx");

    cy.contains(/Please upload an image file/i, { timeout: 6000 }).should(
      "be.visible"
    );
  });

  it("rejects html file uploads", () => {
    mount(
      <AppRouterContext.Provider value={mockAppRouter}>
        <Toaster />
        <UploadImage />
      </AppRouterContext.Provider>
    );

    cy.get('input[type="file"]').attachFile("test.html");

    cy.contains(/Please upload an image file/i, { timeout: 6000 }).should(
      "be.visible"
    );
  });

  it("rejects mp4 file uploads", () => {
    mount(
      <AppRouterContext.Provider value={mockAppRouter}>
        <Toaster />
        <UploadImage />
      </AppRouterContext.Provider>
    );

    cy.get('input[type="file"]').attachFile("test.mp4");

    cy.contains(/Please upload an image file/i, { timeout: 6000 }).should(
      "be.visible"
    );
  });

  it("accepts image file upload", () => {
    mount(
      <AppRouterContext.Provider value={mockAppRouter}>
        <UploadImage />
      </AppRouterContext.Provider>
    );

    cy.get('input[type="file"]').attachFile("test.png");

    // Check that no error appears
    cy.contains(/Please upload an image file/i, { timeout: 6000 }).should(
      "not.exist"
    );

    // ✅ Check that the preview <img> appears with a blob URL
    cy.get("img")
      .should("be.visible")
      .and("have.attr", "src")
      .and("match", /^blob:/);
  });
});
