/// <reference types="cypress" />

context("Cookies", () => {
  beforeEach(() => {
    Cypress.Cookies.debug(true);

    cy.visit("https://example.cypress.io/commands/cookies");

    // clear cookies again after visiting to remove
    // any 3rd party cookies picked up such as cloudflare
    cy.clearCookies();
  });

  it("cy.getCookie() - get a browser cookie", () => {
    // https://on.cypress.io/getcookie
    cy.get("#getCookie .set-a-cookie").click();

    // cy.getCookie() yields a cookie object
    cy.getCookie("token").should("have.property", "value", "123ABC");
  });

  it("cy.getCookies() - get browser cookies", () => {
    // https://on.cypress.io/getcookies
    cy.getCookies().should("be.empty");

    cy.get("#getCookies .set-a-cookie").click();

    // cy.getCookies() yields an array of cookies
    cy.getCookies()
      .should("have.length", 1)
      .should((cookies) => {
        // each cookie has these properties
        expect(cookies[0]).to.have.property("name", "token");
        expect(cookies[0]).to.have.property("value", "123ABC");
        expect(cookies[0]).to.have.property("httpOnly", false);
        expect(cookies[0]).to.have.property("secure", false);
        expect(cookies[0]).to.have.property("domain");
        expect(cookies[0]).to.have.property("path");
      });
  });

  it("cy.setCookie() - set a browser cookie", () => {
    // https://on.cypress.io/setcookie
    cy.getCookies().should("be.empty");

    cy.setCookie("foo", "bar");

    // cy.getCookie() yields a cookie object
    cy.getCookie("foo").should("have.property", "value", "bar");
  });

  it("cy.clearCookie() - clear a browser cookie", () => {
    // https://on.cypress.io/clearcookie
    cy.getCookie("token").should("be.null");

    cy.get("#clearCookie .set-a-cookie").click();

    cy.getCookie("token").should("have.property", "value", "123ABC");

    // cy.clearCookies() yields null
    cy.clearCookie("token").should("be.null");

    cy.getCookie("token").should("be.null");
  });

  it("cy.clearCookies() - clear browser cookies", () => {
    // https://on.cypress.io/clearcookies
    cy.getCookies().should("be.empty");

    cy.get("#clearCookies .set-a-cookie").click();

    cy.getCookies().should("have.length", 1);

    // cy.clearCookies() yields null
    cy.clearCookies();

    cy.getCookies().should("be.empty");
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
});
