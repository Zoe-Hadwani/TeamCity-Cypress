/// <reference types="cypress" />

context("Location", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/commands/location");
  });

  it("cy.hash() - get the current URL hash", () => {
    // https://on.cypress.io/hash
    cy.hash().should("be.empty");
  });

  it("cy.location() - get window.location", () => {
    // https://on.cypress.io/location
    cy.location().should((location) => {
      expect(location.hash).to.be.empty;
      expect(location.href).to.eq(
        "https://example.cypress.io/commands/location"
      );
      expect(location.host).to.eq("example.cypress.io");
      expect(location.hostname).to.eq("example.cypress.io");
      expect(location.origin).to.eq("https://example.cypress.io");
      expect(location.pathname).to.eq("/commands/location");
      expect(location.port).to.eq("");
      expect(location.protocol).to.eq("https:");
      expect(location.search).to.be.empty;
    });
  });

  it("cy.url() - get the current URL", () => {
    // https://on.cypress.io/url
    cy.url().should("eq", "https://example.cypress.io/commands/location");
  });
});
/// <reference types="cypress" />

context("Local Storage", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/commands/local-storage");
  });
  // Although local storage is automatically cleared
  // in between tests to maintain a clean state
  // sometimes we need to clear the local storage manually

  it("cy.clearLocalStorage() - clear all data in local storage", () => {
    // https://on.cypress.io/clearlocalstorage
    cy.get(".ls-btn")
      .click()
      .should(() => {
        expect(localStorage.getItem("prop1")).to.eq("red");
        expect(localStorage.getItem("prop2")).to.eq("blue");
        expect(localStorage.getItem("prop3")).to.eq("magenta");
      });

    // clearLocalStorage() yields the localStorage object
    cy.clearLocalStorage().should((ls) => {
      expect(ls.getItem("prop1")).to.be.null;
      expect(ls.getItem("prop2")).to.be.null;
      expect(ls.getItem("prop3")).to.be.null;
    });

    cy.get(".ls-btn")
      .click()
      .should(() => {
        expect(localStorage.getItem("prop1")).to.eq("red");
        expect(localStorage.getItem("prop2")).to.eq("blue");
        expect(localStorage.getItem("prop3")).to.eq("magenta");
      });

    // Clear key matching string in Local Storage
    cy.clearLocalStorage("prop1").should((ls) => {
      expect(ls.getItem("prop1")).to.be.null;
      expect(ls.getItem("prop2")).to.eq("blue");
      expect(ls.getItem("prop3")).to.eq("magenta");
    });

    cy.get(".ls-btn")
      .click()
      .should(() => {
        expect(localStorage.getItem("prop1")).to.eq("red");
        expect(localStorage.getItem("prop2")).to.eq("blue");
        expect(localStorage.getItem("prop3")).to.eq("magenta");
      });

    // Clear keys matching regex in Local Storage
    cy.clearLocalStorage(/prop1|2/).should((ls) => {
      expect(ls.getItem("prop1")).to.be.null;
      expect(ls.getItem("prop2")).to.be.null;
      expect(ls.getItem("prop3")).to.eq("magenta");
    });
  });
});

/// <reference types="cypress" />

/// JSON fixture file can be loaded directly using
// the built-in JavaScript bundler
const requiredExample = require("../../fixtures/example");

context("Files", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/commands/files");
  });

  beforeEach(() => {
    // load example.json fixture file and store
    // in the test context object
    cy.fixture("example.json").as("example");
  });

  it("cy.fixture() - load a fixture", () => {
    // https://on.cypress.io/fixture

    // Instead of writing a response inline you can
    // use a fixture file's content.

    // when application makes an Ajax request matching "GET **/comments/*"
    // Cypress will intercept it and reply with the object in `example.json` fixture
    cy.intercept("GET", "**/comments/*", { fixture: "example.json" }).as(
      "getComment"
    );

    // we have code that gets a comment when
    // the button is clicked in scripts.js
    cy.get(".fixture-btn").click();

    cy.wait("@getComment")
      .its("response.body")
      .should("have.property", "name")
      .and("include", "Using fixtures to represent data");
  });

  it("cy.fixture() or require - load a fixture", function () {
    // we are inside the "function () { ... }"
    // callback and can use test context object "this"
    // "this.example" was loaded in "beforeEach" function callback
    expect(this.example, "fixture in the test context").to.deep.equal(
      requiredExample
    );

    // or use "cy.wrap" and "should('deep.equal', ...)" assertion
    cy.wrap(this.example).should("deep.equal", requiredExample);
  });

  it("cy.readFile() - read file contents", () => {
    // https://on.cypress.io/readfile

    // You can read a file and yield its contents
    // The filePath is relative to your project's root.
    cy.readFile("cypress.json").then((json) => {
      expect(json).to.be.an("object");
    });
  });

  it("cy.writeFile() - write to a file", () => {
    // https://on.cypress.io/writefile

    // You can write to a file

    // Use a response from a request to automatically
    // generate a fixture file for use later
    cy.request("https://jsonplaceholder.cypress.io/users").then((response) => {
      cy.writeFile("cypress/fixtures/users.json", response.body);
    });

    cy.fixture("users").should((users) => {
      expect(users[0].name).to.exist;
    });

    // JavaScript arrays and objects are stringified
    // and formatted into text.
    cy.writeFile("cypress/fixtures/profile.json", {
      id: 8739,
      name: "Jane",
      email: "jane@example.com",
    });

    cy.fixture("profile").should((profile) => {
      expect(profile.name).to.eq("Jane");
    });
  });
});
