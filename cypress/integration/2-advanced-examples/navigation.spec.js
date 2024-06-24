/// <reference types="cypress" />

context("Navigation", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io");
    cy.get(".navbar-nav").contains("Commands").click();
    cy.get(".dropdown-menu").contains("Navigation").click();
  });

  it("cy.go() - go back or forward in the browser's history", () => {
    // https://on.cypress.io/go

    cy.location("pathname").should("include", "navigation");

    cy.go("back");
    cy.location("pathname").should("not.include", "navigation");

    cy.go("forward");
    cy.location("pathname").should("include", "navigation");

    // clicking back
    cy.go(-1);
    cy.location("pathname").should("not.include", "navigation");

    // clicking forward
    cy.go(1);
    cy.location("pathname").should("include", "navigation");
  });

  it("cy.reload() - reload the page", () => {
    // https://on.cypress.io/reload
    cy.reload();

    // reload the page without using the cache
    cy.reload(true);
  });

  it("cy.visit() - visit a remote url", () => {
    // https://on.cypress.io/visit

    // Visit any sub-domain of your current domain

    // Pass options to the visit
    cy.visit("https://example.cypress.io/commands/navigation", {
      timeout: 50000, // increase total time for the visit to resolve
      onBeforeLoad(contentWindow) {
        // contentWindow is the remote page's window object
        expect(typeof contentWindow === "object").to.be.true;
      },
      onLoad(contentWindow) {
        // contentWindow is the remote page's window object
        expect(typeof contentWindow === "object").to.be.true;
      },
    });
  });
});
/// <reference types="cypress" />

context("Misc", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/commands/misc");
  });

  it(".end() - end the command chain", () => {
    // https://on.cypress.io/end

    // cy.end is useful when you want to end a chain of commands
    // and force Cypress to re-query from the root element
    cy.get(".misc-table").within(() => {
      // ends the current chain and yields null
      cy.contains("Cheryl").click().end();

      // queries the entire table again
      cy.contains("Charles").click();
    });
  });

  it("cy.exec() - execute a system command", () => {
    // execute a system command.
    // so you can take actions necessary for
    // your test outside the scope of Cypress.
    // https://on.cypress.io/exec

    // we can use Cypress.platform string to
    // select appropriate command
    // https://on.cypress/io/platform
    cy.log(`Platform ${Cypress.platform} architecture ${Cypress.arch}`);

    // on CircleCI Windows build machines we have a failure to run bash shell
    // https://github.com/cypress-io/cypress/issues/5169
    // so skip some of the tests by passing flag "--env circle=true"
    const isCircleOnWindows =
      Cypress.platform === "win32" && Cypress.env("circle");

    if (isCircleOnWindows) {
      cy.log("Skipping test on CircleCI");

      return;
    }

    // cy.exec problem on Shippable CI
    // https://github.com/cypress-io/cypress/issues/6718
    const isShippable =
      Cypress.platform === "linux" && Cypress.env("shippable");

    if (isShippable) {
      cy.log("Skipping test on ShippableCI");

      return;
    }

    cy.exec("echo Jane Lane").its("stdout").should("contain", "Jane Lane");

    if (Cypress.platform === "win32") {
      cy.exec("print cypress.json").its("stderr").should("be.empty");
    } else {
      cy.exec("cat cypress.json").its("stderr").should("be.empty");

      cy.exec("pwd").its("code").should("eq", 0);
    }
  });

  it("cy.focused() - get the DOM element that has focus", () => {
    // https://on.cypress.io/focused
    cy.get(".misc-form").find("#name").click();
    cy.focused().should("have.id", "name");

    cy.get(".misc-form").find("#description").click();
    cy.focused().should("have.id", "description");
  });

  context("Cypress.Screenshot", function () {
    it("cy.screenshot() - take a screenshot", () => {
      // https://on.cypress.io/screenshot
      cy.screenshot("my-image");
    });

    it("Cypress.Screenshot.defaults() - change default config of screenshots", function () {
      Cypress.Screenshot.defaults({
        blackout: [".foo"],
        capture: "viewport",
        clip: { x: 0, y: 0, width: 200, height: 200 },
        scale: false,
        disableTimersAndAnimations: true,
        screenshotOnRunFailure: true,
        onBeforeScreenshot() {},
        onAfterScreenshot() {},
      });
    });
  });

  it("cy.wrap() - wrap an object", () => {
    // https://on.cypress.io/wrap
    cy.wrap({ foo: "bar" })
      .should("have.property", "foo")
      .and("include", "bar");
  });
});
