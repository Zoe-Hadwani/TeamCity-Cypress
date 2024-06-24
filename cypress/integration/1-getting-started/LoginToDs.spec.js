/// <reference types="cypress" />

describe("Industry Sector/Project Type", function () {
  Cypress.Cookies.defaults({
    preserve: "__Host-spa",
  });

  describe("Add Filter Project Search", () => {
    it("Add filter", () => {
      cy.visit("https://eicdatastream4canary.the-eic.com/");

      cy.get("#LoginName")
        .clear()
        .type("zoe.hadwani@the-eic.com", { log: false });
      cy.get("#Password")
        .clear()
        .type("Ocean999", { log: false }, { sensitive: true });
      cy.get("button[value='login']").click({
        force: true,
      });
      cy.title().should("be.eq", "EICDataStream4");
    });

    it("Search", () => {
      cy.get("#mnuSearch > .menu-title").click({ force: true });
      cy.should("be.visible").should("have.class", "menu-title").wait(4000);
    });

    it("Project", () => {
      cy.get(
        "#mnuSearch-CapexProjects > .mat-list-item-content > .mat-list-text"
      )
        .click({ force: true })
        .wait(4000);
    });
    it("Add filter", () => {
      cy.get(".ng-untouched > .btn-group > .dropdown-toggle").click({
        force: true,
      });
      cy.should("have.length", 1);
    });

    it("New Search", () => {
      cy.get("#newSearchButton > label > button").click({ force: true });
      cy.should("have.length", 1);
    });
  });
});
