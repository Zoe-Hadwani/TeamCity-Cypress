/// <reference types="cypress" />
// remove no check once Cypress.sinon is typed
// https://github.com/cypress-io/cypress/issues/6720

context("Spies, Stubs, and Clock", () => {
  it("cy.spy() - wrap a method in a spy", () => {
    // https://on.cypress.io/spy
    cy.visit("https://example.cypress.io/commands/spies-stubs-clocks");

    const obj = {
      foo() {},
    };

    const spy = cy.spy(obj, "foo").as("anyArgs");

    obj.foo();

    expect(spy).to.be.called;
  });

  it("cy.spy() retries until assertions pass", () => {
    cy.visit("https://example.cypress.io/commands/spies-stubs-clocks");

    const obj = {
      /**
       * Prints the argument passed
       * @param x {any}
       */
      foo(x) {
        console.log("obj.foo called with", x);
      },
    };

    cy.spy(obj, "foo").as("foo");

    setTimeout(() => {
      obj.foo("first");
    }, 500);

    setTimeout(() => {
      obj.foo("second");
    }, 2500);

    cy.get("@foo").should("have.been.calledTwice");
  });

  it("cy.stub() - create a stub and/or replace a function with stub", () => {
    // https://on.cypress.io/stub
    cy.visit("https://example.cypress.io/commands/spies-stubs-clocks");

    const obj = {
      /**
       * prints both arguments to the console
       * @param a {string}
       * @param b {string}
       */
      foo(a, b) {
        console.log("a", a, "b", b);
      },
    };

    const stub = cy.stub(obj, "foo").as("foo");

    obj.foo("foo", "bar");

    expect(stub).to.be.called;
  });

  it("cy.clock() - control time in the browser", () => {
    // https://on.cypress.io/clock

    // create the date in UTC so its always the same
    // no matter what local timezone the browser is running in
    const now = new Date(Date.UTC(2017, 2, 14)).getTime();

    cy.clock(now);
    cy.visit("https://example.cypress.io/commands/spies-stubs-clocks");
    cy.get("#clock-div").click().should("have.text", "1489449600");
  });

  it("cy.tick() - move time in the browser", () => {
    // https://on.cypress.io/tick

    // create the date in UTC so its always the same
    // no matter what local timezone the browser is running in
    const now = new Date(Date.UTC(2017, 2, 14)).getTime();

    cy.clock(now);
    cy.visit("https://example.cypress.io/commands/spies-stubs-clocks");
    cy.get("#tick-div").click().should("have.text", "1489449600");

    cy.tick(10000); // 10 seconds passed
    cy.get("#tick-div").click().should("have.text", "1489449610");
  });

  it("cy.stub() matches depending on arguments", () => {
    // see all possible matchers at
    // https://sinonjs.org/releases/latest/matchers/
    const greeter = {
      /**
       * Greets a person
       * @param {string} name
       */
      greet(name) {
        return `Hello, ${name}!`;
      },
    };

    cy.stub(greeter, "greet")
      .callThrough() // if you want non-matched calls to call the real method
      .withArgs(Cypress.sinon.match.string)
      .returns("Hi")
      .withArgs(Cypress.sinon.match.number)
      .throws(new Error("Invalid name"));

    expect(greeter.greet("World")).to.equal("Hi");
    expect(() => greeter.greet(42)).to.throw("Invalid name");
    expect(greeter.greet).to.have.been.calledTwice;

    // non-matched calls goes the actual method
    expect(greeter.greet()).to.equal("Hello, undefined!");
  });

  it("matches call arguments using Sinon matchers", () => {
    // see all possible matchers at
    // https://sinonjs.org/releases/latest/matchers/
    const calculator = {
      /**
       * returns the sum of two arguments
       * @param a {number}
       * @param b {number}
       */
      add(a, b) {
        return a + b;
      },
    };

    const spy = cy.spy(calculator, "add").as("add");

    expect(calculator.add(2, 3)).to.equal(5);

    // if we want to assert the exact values used during the call
    expect(spy).to.be.calledWith(2, 3);

    // let's confirm "add" method was called with two numbers
    expect(spy).to.be.calledWith(
      Cypress.sinon.match.number,
      Cypress.sinon.match.number
    );

    // alternatively, provide the value to match
    expect(spy).to.be.calledWith(
      Cypress.sinon.match(2),
      Cypress.sinon.match(3)
    );

    // match any value
    expect(spy).to.be.calledWith(Cypress.sinon.match.any, 3);

    // match any value from a list
    expect(spy).to.be.calledWith(Cypress.sinon.match.in([1, 2, 3]), 3);

    /**
     * Returns true if the given number is even
     * @param {number} x
     */
    const isEven = (x) => x % 2 === 0;

    // expect the value to pass a custom predicate function
    // the second argument to "sinon.match(predicate, message)" is
    // shown if the predicate does not pass and assertion fails
    expect(spy).to.be.calledWith(Cypress.sinon.match(isEven, "isEven"), 3);

    /**
     * Returns a function that checks if a given number is larger than the limit
     * @param {number} limit
     * @returns {(x: number) => boolean}
     */
    const isGreaterThan = (limit) => (x) => x > limit;

    /**
     * Returns a function that checks if a given number is less than the limit
     * @param {number} limit
     * @returns {(x: number) => boolean}
     */
    const isLessThan = (limit) => (x) => x < limit;

    // you can combine several matchers using "and", "or"
    expect(spy).to.be.calledWith(
      Cypress.sinon.match.number,
      Cypress.sinon
        .match(isGreaterThan(2), "> 2")
        .and(Cypress.sinon.match(isLessThan(4), "< 4"))
    );

    expect(spy).to.be.calledWith(
      Cypress.sinon.match.number,
      Cypress.sinon
        .match(isGreaterThan(200), "> 200")
        .or(Cypress.sinon.match(3))
    );

    // matchers can be used from BDD assertions
    cy.get("@add").should(
      "have.been.calledWith",
      Cypress.sinon.match.number,
      Cypress.sinon.match(3)
    );

    // you can alias matchers for shorter test code
    const { match: M } = Cypress.sinon;

    cy.get("@add").should("have.been.calledWith", M.number, M(3));
  });
});
/// <reference types="cypress" />

context("Querying", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/commands/querying");
  });

  // The most commonly used query is 'cy.get()', you can
  // think of this like the '$' in jQuery

  it("cy.get() - query DOM elements", () => {
    // https://on.cypress.io/get

    cy.get("#query-btn").should("contain", "Button");

    cy.get(".query-btn").should("contain", "Button");

    cy.get("#querying .well>button:first").should("contain", "Button");
    //              ↲
    // Use CSS selectors just like jQuery

    cy.get('[data-test-id="test-example"]').should("have.class", "example");

    // 'cy.get()' yields jQuery object, you can get its attribute
    // by invoking `.attr()` method
    cy.get('[data-test-id="test-example"]')
      .invoke("attr", "data-test-id")
      .should("equal", "test-example");

    // or you can get element's CSS property
    cy.get('[data-test-id="test-example"]')
      .invoke("css", "position")
      .should("equal", "static");

    // or use assertions directly during 'cy.get()'
    // https://on.cypress.io/assertions
    cy.get('[data-test-id="test-example"]')
      .should("have.attr", "data-test-id", "test-example")
      .and("have.css", "position", "static");
  });

  it("cy.contains() - query DOM elements with matching content", () => {
    // https://on.cypress.io/contains
    cy.get(".query-list").contains("bananas").should("have.class", "third");

    // we can pass a regexp to `.contains()`
    cy.get(".query-list").contains(/^b\w+/).should("have.class", "third");

    cy.get(".query-list").contains("apples").should("have.class", "first");

    // passing a selector to contains will
    // yield the selector containing the text
    cy.get("#querying")
      .contains("ul", "oranges")
      .should("have.class", "query-list");

    cy.get(".query-button").contains("Save Form").should("have.class", "btn");
  });

  it(".within() - query DOM elements within a specific element", () => {
    // https://on.cypress.io/within
    cy.get(".query-form").within(() => {
      cy.get("input:first").should("have.attr", "placeholder", "Email");
      cy.get("input:last").should("have.attr", "placeholder", "Password");
    });
  });

  it("cy.root() - query the root DOM element", () => {
    // https://on.cypress.io/root

    // By default, root is the document
    cy.root().should("match", "html");

    cy.get(".query-ul").within(() => {
      // In this within, the root is now the ul DOM element
      cy.root().should("have.class", "query-ul");
    });
  });

  it("best practices - selecting elements", () => {
    // https://on.cypress.io/best-practices#Selecting-Elements
    cy.get("[data-cy=best-practices-selecting-elements]").within(() => {
      // Worst - too generic, no context
      cy.get("button").click();

      // Bad. Coupled to styling. Highly subject to change.
      cy.get(".btn.btn-large").click();

      // Average. Coupled to the `name` attribute which has HTML semantics.
      cy.get("[name=submission]").click();

      // Better. But still coupled to styling or JS event listeners.
      cy.get("#main").click();

      // Slightly better. Uses an ID but also ensures the element
      // has an ARIA role attribute
      cy.get("#main[role=button]").click();

      // Much better. But still coupled to text content that may change.
      cy.contains("Submit").click();

      // Best. Insulated from all changes.
      cy.get("[data-cy=submit]").click();
    });
  });
});

/// <reference types="cypress" />

context("Traversal", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/commands/traversal");
  });

  it(".children() - get child DOM elements", () => {
    // https://on.cypress.io/children
    cy.get(".traversal-breadcrumb")
      .children(".active")
      .should("contain", "Data");
  });

  it(".closest() - get closest ancestor DOM element", () => {
    // https://on.cypress.io/closest
    cy.get(".traversal-badge").closest("ul").should("have.class", "list-group");
  });

  it(".eq() - get a DOM element at a specific index", () => {
    // https://on.cypress.io/eq
    cy.get(".traversal-list>li").eq(1).should("contain", "siamese");
  });

  it(".filter() - get DOM elements that match the selector", () => {
    // https://on.cypress.io/filter
    cy.get(".traversal-nav>li").filter(".active").should("contain", "About");
  });

  it(".find() - get descendant DOM elements of the selector", () => {
    // https://on.cypress.io/find
    cy.get(".traversal-pagination")
      .find("li")
      .find("a")
      .should("have.length", 7);
  });

  it(".first() - get first DOM element", () => {
    // https://on.cypress.io/first
    cy.get(".traversal-table td").first().should("contain", "1");
  });

  it(".last() - get last DOM element", () => {
    // https://on.cypress.io/last
    cy.get(".traversal-buttons .btn").last().should("contain", "Submit");
  });

  it(".next() - get next sibling DOM element", () => {
    // https://on.cypress.io/next
    cy.get(".traversal-ul")
      .contains("apples")
      .next()
      .should("contain", "oranges");
  });

  it(".nextAll() - get all next sibling DOM elements", () => {
    // https://on.cypress.io/nextall
    cy.get(".traversal-next-all")
      .contains("oranges")
      .nextAll()
      .should("have.length", 3);
  });

  it(".nextUntil() - get next sibling DOM elements until next el", () => {
    // https://on.cypress.io/nextuntil
    cy.get("#veggies").nextUntil("#nuts").should("have.length", 3);
  });

  it(".not() - remove DOM elements from set of DOM elements", () => {
    // https://on.cypress.io/not
    cy.get(".traversal-disabled .btn")
      .not("[disabled]")
      .should("not.contain", "Disabled");
  });

  it(".parent() - get parent DOM element from DOM elements", () => {
    // https://on.cypress.io/parent
    cy.get(".traversal-mark").parent().should("contain", "Morbi leo risus");
  });

  it(".parents() - get parent DOM elements from DOM elements", () => {
    // https://on.cypress.io/parents
    cy.get(".traversal-cite").parents().should("match", "blockquote");
  });

  it(".parentsUntil() - get parent DOM elements from DOM elements until el", () => {
    // https://on.cypress.io/parentsuntil
    cy.get(".clothes-nav")
      .find(".active")
      .parentsUntil(".clothes-nav")
      .should("have.length", 2);
  });

  it(".prev() - get previous sibling DOM element", () => {
    // https://on.cypress.io/prev
    cy.get(".birds").find(".active").prev().should("contain", "Lorikeets");
  });

  it(".prevAll() - get all previous sibling DOM elements", () => {
    // https://on.cypress.io/prevall
    cy.get(".fruits-list").find(".third").prevAll().should("have.length", 2);
  });

  it(".prevUntil() - get all previous sibling DOM elements until el", () => {
    // https://on.cypress.io/prevuntil
    cy.get(".foods-list")
      .find("#nuts")
      .prevUntil("#veggies")
      .should("have.length", 3);
  });

  it(".siblings() - get all sibling DOM elements", () => {
    // https://on.cypress.io/siblings
    cy.get(".traversal-pills .active").siblings().should("have.length", 2);
  });
});
