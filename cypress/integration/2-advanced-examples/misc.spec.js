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
/// <reference types="cypress" />

context("Waiting", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/commands/waiting");
  });
  // BE CAREFUL of adding unnecessary wait times.
  // https://on.cypress.io/best-practices#Unnecessary-Waiting

  // https://on.cypress.io/wait
  it("cy.wait() - wait for a specific amount of time", () => {
    cy.get(".wait-input1").type("Wait 1000ms after typing");
    cy.wait(1000);
    cy.get(".wait-input2").type("Wait 1000ms after typing");
    cy.wait(1000);
    cy.get(".wait-input3").type("Wait 1000ms after typing");
    cy.wait(1000);
  });

  it("cy.wait() - wait for a specific route", () => {
    // Listen to GET to comments/1
    cy.intercept("GET", "**/comments/*").as("getComment");

    // we have code that gets a comment when
    // the button is clicked in scripts.js
    cy.get(".network-btn").click();

    // wait for GET comments/1
    cy.wait("@getComment")
      .its("response.statusCode")
      .should("be.oneOf", [200, 304]);
  });
});

/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe("example to-do app", () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit("https://example.cypress.io/todo");
  });

  it("displays two todo items by default", () => {
    // We use the `cy.get()` command to get all elements that match the selector.
    // Then, we use `should` to assert that there are two matched items,
    // which are the two default items.
    cy.get(".todo-list li").should("have.length", 2);

    // We can go even further and check that the default todos each contain
    // the correct text. We use the `first` and `last` functions
    // to get just the first and last matched elements individually,
    // and then perform an assertion with `should`.
    cy.get(".todo-list li").first().should("have.text", "Pay electric bill");
    cy.get(".todo-list li").last().should("have.text", "Walk the dog");
  });

  it("can add new todo items", () => {
    // We'll store our item text in a variable so we can reuse it
    const newItem = "Feed the cat";

    // Let's get the input element and use the `type` command to
    // input our new list item. After typing the content of our item,
    // we need to type the enter key as well in order to submit the input.
    // This input has a data-test attribute so we'll use that to select the
    // element in accordance with best practices:
    // https://on.cypress.io/selecting-elements
    cy.get("[data-test=new-todo]").type(`${newItem}{enter}`);

    // Now that we've typed our new item, let's check that it actually was added to the list.
    // Since it's the newest item, it should exist as the last element in the list.
    // In addition, with the two default items, we should have a total of 3 elements in the list.
    // Since assertions yield the element that was asserted on,
    // we can chain both of these assertions together into a single statement.
    cy.get(".todo-list li")
      .should("have.length", 3)
      .last()
      .should("have.text", newItem);
  });

  it("can check off an item as completed", () => {
    // In addition to using the `get` command to get an element by selector,
    // we can also use the `contains` command to get an element by its contents.
    // However, this will yield the <label>, which is lowest-level element that contains the text.
    // In order to check the item, we'll find the <input> element for this <label>
    // by traversing up the dom to the parent element. From there, we can `find`
    // the child checkbox <input> element and use the `check` command to check it.
    cy.contains("Pay electric bill")
      .parent()
      .find("input[type=checkbox]")
      .check();

    // Now that we've checked the button, we can go ahead and make sure
    // that the list element is now marked as completed.
    // Again we'll use `contains` to find the <label> element and then use the `parents` command
    // to traverse multiple levels up the dom until we find the corresponding <li> element.
    // Once we get that element, we can assert that it has the completed class.
    cy.contains("Pay electric bill")
      .parents("li")
      .should("have.class", "completed");
  });

  context("with a checked task", () => {
    beforeEach(() => {
      // We'll take the command we used above to check off an element
      // Since we want to perform multiple tests that start with checking
      // one element, we put it in the beforeEach hook
      // so that it runs at the start of every test.
      cy.contains("Pay electric bill")
        .parent()
        .find("input[type=checkbox]")
        .check();
    });

    it("can filter for uncompleted tasks", () => {
      // We'll click on the "active" button in order to
      // display only incomplete items
      cy.contains("Active").click();

      // After filtering, we can assert that there is only the one
      // incomplete item in the list.
      cy.get(".todo-list li")
        .should("have.length", 1)
        .first()
        .should("have.text", "Walk the dog");

      // For good measure, let's also assert that the task we checked off
      // does not exist on the page.
      cy.contains("Pay electric bill").should("not.exist");
    });

    it("can filter for completed tasks", () => {
      // We can perform similar steps as the test above to ensure
      // that only completed tasks are shown
      cy.contains("Completed").click();

      cy.get(".todo-list li")
        .should("have.length", 1)
        .first()
        .should("have.text", "Pay electric bill");

      cy.contains("Walk the dog").should("not.exist");
    });

    it("can delete all completed tasks", () => {
      // First, let's click the "Clear completed" button
      // `contains` is actually serving two purposes here.
      // First, it's ensuring that the button exists within the dom.
      // This button only appears when at least one task is checked
      // so this command is implicitly verifying that it does exist.
      // Second, it selects the button so we can click it.
      cy.contains("Clear completed").click();

      // Then we can make sure that there is only one element
      // in the list and our element does not exist
      cy.get(".todo-list li")
        .should("have.length", 1)
        .should("not.have.text", "Pay electric bill");

      // Finally, make sure that the clear button no longer exists.
      cy.contains("Clear completed").should("not.exist");
    });
  });
});
