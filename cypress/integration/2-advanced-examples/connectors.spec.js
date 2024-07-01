/// <reference types="cypress" />

context("Connectors", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/commands/connectors");
  });

  it(".each() - iterate over an array of elements", () => {
    // https://on.cypress.io/each
    cy.get(".connectors-each-ul>li").each(($el, index, $list) => {
      console.log($el, index, $list);
    });
  });

  it(".its() - get properties on the current subject", () => {
    // https://on.cypress.io/its
    cy.get(".connectors-its-ul>li")
      // calls the 'length' property yielding that value
      .its("length")
      .should("be.gt", 2);
  });

  it(".invoke() - invoke a function on the current subject", () => {
    // our div is hidden in our script.js
    // $('.connectors-div').hide()

    // https://on.cypress.io/invoke
    cy.get(".connectors-div")
      .should("be.hidden")
      // call the jquery method 'show' on the 'div.container'
      .invoke("show")
      .should("be.visible");
  });

  it(".spread() - spread an array as individual args to callback function", () => {
    // https://on.cypress.io/spread
    const arr = ["foo", "bar", "baz"];

    cy.wrap(arr).spread((foo, bar, baz) => {
      expect(foo).to.eq("foo");
      expect(bar).to.eq("bar");
      expect(baz).to.eq("baz");
    });
  });

  describe(".then()", () => {
    it("invokes a callback function with the current subject", () => {
      // https://on.cypress.io/then
      cy.get(".connectors-list > li").then(($lis) => {
        expect($lis, "3 items").to.have.length(3);
        expect($lis.eq(0), "first item").to.contain("Walk the dog");
        expect($lis.eq(1), "second item").to.contain("Feed the cat");
        expect($lis.eq(2), "third item").to.contain("Write JavaScript");
      });
    });

    it("yields the returned value to the next command", () => {
      cy.wrap(1)
        .then((num) => {
          expect(num).to.equal(1);

          return 2;
        })
        .then((num) => {
          expect(num).to.equal(2);
        });
    });

    it("yields the original subject without return", () => {
      cy.wrap(1)
        .then((num) => {
          expect(num).to.equal(1);
          // note that nothing is returned from this callback
        })
        .then((num) => {
          // this callback receives the original unchanged value 1
          expect(num).to.equal(1);
        });
    });

    it("yields the value yielded by the last Cypress command inside", () => {
      cy.wrap(1)
        .then((num) => {
          expect(num).to.equal(1);
          // note how we run a Cypress command
          // the result yielded by this Cypress command
          // will be passed to the second ".then"
          cy.wrap(2);
        })
        .then((num) => {
          // this callback receives the value yielded by "cy.wrap(2)"
          expect(num).to.equal(2);
        });
    });
  });
});
/// <reference types="cypress" />

context("Connectors", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/commands/connectors");
  });

  it(".each() - iterate over an array of elements", () => {
    // https://on.cypress.io/each
    cy.get(".connectors-each-ul>li").each(($el, index, $list) => {
      console.log($el, index, $list);
    });
  });

  it(".its() - get properties on the current subject", () => {
    // https://on.cypress.io/its
    cy.get(".connectors-its-ul>li")
      // calls the 'length' property yielding that value
      .its("length")
      .should("be.gt", 2);
  });

  it(".invoke() - invoke a function on the current subject", () => {
    // our div is hidden in our script.js
    // $('.connectors-div').hide()

    // https://on.cypress.io/invoke
    cy.get(".connectors-div")
      .should("be.hidden")
      // call the jquery method 'show' on the 'div.container'
      .invoke("show")
      .should("be.visible");
  });

  it(".spread() - spread an array as individual args to callback function", () => {
    // https://on.cypress.io/spread
    const arr = ["foo", "bar", "baz"];

    cy.wrap(arr).spread((foo, bar, baz) => {
      expect(foo).to.eq("foo");
      expect(bar).to.eq("bar");
      expect(baz).to.eq("baz");
    });
  });

  describe(".then()", () => {
    it("invokes a callback function with the current subject", () => {
      // https://on.cypress.io/then
      cy.get(".connectors-list > li").then(($lis) => {
        expect($lis, "3 items").to.have.length(3);
        expect($lis.eq(0), "first item").to.contain("Walk the dog");
        expect($lis.eq(1), "second item").to.contain("Feed the cat");
        expect($lis.eq(2), "third item").to.contain("Write JavaScript");
      });
    });

    it("yields the returned value to the next command", () => {
      cy.wrap(1)
        .then((num) => {
          expect(num).to.equal(1);

          return 2;
        })
        .then((num) => {
          expect(num).to.equal(2);
        });
    });

    it("yields the original subject without return", () => {
      cy.wrap(1)
        .then((num) => {
          expect(num).to.equal(1);
          // note that nothing is returned from this callback
        })
        .then((num) => {
          // this callback receives the original unchanged value 1
          expect(num).to.equal(1);
        });
    });

    it("yields the value yielded by the last Cypress command inside", () => {
      cy.wrap(1)
        .then((num) => {
          expect(num).to.equal(1);
          // note how we run a Cypress command
          // the result yielded by this Cypress command
          // will be passed to the second ".then"
          cy.wrap(2);
        })
        .then((num) => {
          // this callback receives the value yielded by "cy.wrap(2)"
          expect(num).to.equal(2);
        });
    });
  });
}); /// <reference types="cypress" />

context("Assertions", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/commands/assertions");
  });

  describe("Implicit Assertions", () => {
    it(".should() - make an assertion about the current subject", () => {
      // https://on.cypress.io/should
      cy.get(".assertion-table")
        .find("tbody tr:last")
        .should("have.class", "success")
        .find("td")
        .first()
        // checking the text of the <td> element in various ways
        .should("have.text", "Column content")
        .should("contain", "Column content")
        .should("have.html", "Column content")
        // chai-jquery uses "is()" to check if element matches selector
        .should("match", "td")
        // to match text content against a regular expression
        // first need to invoke jQuery method text()
        // and then match using regular expression
        .invoke("text")
        .should("match", /column content/i);

      // a better way to check element's text content against a regular expression
      // is to use "cy.contains"
      // https://on.cypress.io/contains
      cy.get(".assertion-table")
        .find("tbody tr:last")
        // finds first <td> element with text content matching regular expression
        .contains("td", /column content/i)
        .should("be.visible");

      // for more information about asserting element's text
      // see https://on.cypress.io/using-cypress-faq#How-do-I-get-an-element’s-text-contents
    });

    it(".and() - chain multiple assertions together", () => {
      // https://on.cypress.io/and
      cy.get(".assertions-link")
        .should("have.class", "active")
        .and("have.attr", "href")
        .and("include", "cypress.io");
    });
  });

  describe("Explicit Assertions", () => {
    // https://on.cypress.io/assertions
    it("expect - make an assertion about a specified subject", () => {
      // We can use Chai's BDD style assertions
      expect(true).to.be.true;
      const o = { foo: "bar" };

      expect(o).to.equal(o);
      expect(o).to.deep.equal({ foo: "bar" });
      // matching text using regular expression
      expect("FooBar").to.match(/bar$/i);
    });

    it("pass your own callback function to should()", () => {
      // Pass a function to should that can have any number
      // of explicit assertions within it.
      // The ".should(cb)" function will be retried
      // automatically until it passes all your explicit assertions or times out.
      cy.get(".assertions-p")
        .find("p")
        .should(($p) => {
          // https://on.cypress.io/$
          // return an array of texts from all of the p's
          const texts = $p.map((i, el) => Cypress.$(el).text());

          // jquery map returns jquery object
          // and .get() convert this to simple array
          const paragraphs = texts.get();

          // array should have length of 3
          expect(paragraphs, "has 3 paragraphs").to.have.length(3);

          // use second argument to expect(...) to provide clear
          // message with each assertion
          expect(paragraphs, "has expected text in each paragraph").to.deep.eq([
            "Some text from first p",
            "More text from second p",
            "And even more text from third p",
          ]);
        });
    });

    it("finds element by class name regex", () => {
      cy.get(".docs-header")
        .find("div")
        // .should(cb) callback function will be retried
        .should(($div) => {
          expect($div).to.have.length(1);

          const className = $div[0].className;

          expect(className).to.match(/heading-/);
        })
        // .then(cb) callback is not retried,
        // it either passes or fails
        .then(($div) => {
          expect($div, "text content").to.have.text("Introduction");
        });
    });

    it("can throw any error", () => {
      cy.get(".docs-header")
        .find("div")
        .should(($div) => {
          if ($div.length !== 1) {
            // you can throw your own errors
            throw new Error("Did not find 1 element");
          }

          const className = $div[0].className;

          if (!className.match(/heading-/)) {
            throw new Error(`Could not find class "heading-" in ${className}`);
          }
        });
    });

    it("matches unknown text between two elements", () => {
      /**
       * Text from the first element.
       * @type {string}
       */
      let text;

      /**
       * Normalizes passed text,
       * useful before comparing text with spaces and different capitalization.
       * @param {string} s Text to normalize
       */
      const normalizeText = (s) => s.replace(/\s/g, "").toLowerCase();

      cy.get(".two-elements")
        .find(".first")
        .then(($first) => {
          // save text from the first element
          text = normalizeText($first.text());
        });

      cy.get(".two-elements")
        .find(".second")
        .should(($div) => {
          // we can massage text before comparing
          const secondText = normalizeText($div.text());

          expect(secondText, "second text").to.equal(text);
        });
    });

    it("assert - assert shape of an object", () => {
      const person = {
        name: "Joe",
        age: 20,
      };

      assert.isObject(person, "value is object");
    });

    it("retries the should callback until assertions pass", () => {
      cy.get("#random-number").should(($div) => {
        const n = parseFloat($div.text());

        expect(n).to.be.gte(1).and.be.lte(10);
      });
    });
  });
});
