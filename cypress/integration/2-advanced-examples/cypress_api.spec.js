/// <reference types="cypress" />

context("Cypress.Commands", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/cypress-api");
  });

  // https://on.cypress.io/custom-commands

  it(".add() - create a custom command", () => {
    Cypress.Commands.add(
      "console",
      {
        prevSubject: true,
      },
      (subject, method) => {
        // the previous subject is automatically received
        // and the commands arguments are shifted

        // allow us to change the console method used
        method = method || "log";

        // log the subject to the console
        console[method]("The subject is", subject);

        // whatever we return becomes the new subject
        // we don't want to change the subject so
        // we return whatever was passed in
        return subject;
      }
    );

    cy.get("button")
      .console("info")
      .then(($button) => {
        // subject is still $button
      });
  });
});

context("Cypress.Cookies", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/cypress-api");
  });

  // https://on.cypress.io/cookies
  it(".debug() - enable or disable debugging", () => {
    Cypress.Cookies.debug(true);

    // Cypress will now log in the console when
    // cookies are set or cleared
    cy.setCookie("fakeCookie", "123ABC");
    cy.clearCookie("fakeCookie");
    cy.setCookie("fakeCookie", "123ABC");
    cy.clearCookie("fakeCookie");
    cy.setCookie("fakeCookie", "123ABC");
  });

  it(".preserveOnce() - preserve cookies by key", () => {
    // normally cookies are reset after each test
    cy.getCookie("fakeCookie").should("not.be.ok");

    // preserving a cookie will not clear it when
    // the next test starts
    cy.setCookie("lastCookie", "789XYZ");
    Cypress.Cookies.preserveOnce("lastCookie");
  });

  it(".defaults() - set defaults for all cookies", () => {
    // now any cookie with the name 'session_id' will
    // not be cleared before each new test runs
    Cypress.Cookies.defaults({
      preserve: "session_id",
    });
  });
});

context("Cypress.arch", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/cypress-api");
  });

  it("Get CPU architecture name of underlying OS", () => {
    // https://on.cypress.io/arch
    expect(Cypress.arch).to.exist;
  });
});

context("Cypress.config()", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/cypress-api");
  });

  it("Get and set configuration options", () => {
    // https://on.cypress.io/config
    let myConfig = Cypress.config();

    expect(myConfig).to.have.property("animationDistanceThreshold", 5);
    expect(myConfig).to.have.property("baseUrl", null);
    expect(myConfig).to.have.property("defaultCommandTimeout", 4000);
    expect(myConfig).to.have.property("requestTimeout", 5000);
    expect(myConfig).to.have.property("responseTimeout", 30000);
    expect(myConfig).to.have.property("viewportHeight", 660);
    expect(myConfig).to.have.property("viewportWidth", 1000);
    expect(myConfig).to.have.property("pageLoadTimeout", 60000);
    expect(myConfig).to.have.property("waitForAnimations", true);

    expect(Cypress.config("pageLoadTimeout")).to.eq(60000);

    // this will change the config for the rest of your tests!
    Cypress.config("pageLoadTimeout", 20000);

    expect(Cypress.config("pageLoadTimeout")).to.eq(20000);

    Cypress.config("pageLoadTimeout", 60000);
  });
});

context("Cypress.dom", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/cypress-api");
  });

  // https://on.cypress.io/dom
  it(".isHidden() - determine if a DOM element is hidden", () => {
    let hiddenP = Cypress.$(".dom-p p.hidden").get(0);
    let visibleP = Cypress.$(".dom-p p.visible").get(0);

    // our first paragraph has css class 'hidden'
    expect(Cypress.dom.isHidden(hiddenP)).to.be.true;
    expect(Cypress.dom.isHidden(visibleP)).to.be.false;
  });
});

context("Cypress.env()", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/cypress-api");
  });

  // We can set environment variables for highly dynamic values

  // https://on.cypress.io/environment-variables
  it("Get environment variables", () => {
    // https://on.cypress.io/env
    // set multiple environment variables
    Cypress.env({
      host: "veronica.dev.local",
      api_server: "http://localhost:8888/v1/",
    });

    // get environment variable
    expect(Cypress.env("host")).to.eq("veronica.dev.local");

    // set environment variable
    Cypress.env("api_server", "http://localhost:8888/v2/");
    expect(Cypress.env("api_server")).to.eq("http://localhost:8888/v2/");

    // get all environment variable
    expect(Cypress.env()).to.have.property("host", "veronica.dev.local");
    expect(Cypress.env()).to.have.property(
      "api_server",
      "http://localhost:8888/v2/"
    );
  });
}); /// <reference types="cypress" />

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

context("Cypress.log", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/cypress-api");
  });

  it("Control what is printed to the Command Log", () => {
    // https://on.cypress.io/cypress-log
  });
});

context("Cypress.platform", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/cypress-api");
  });

  it("Get underlying OS name", () => {
    // https://on.cypress.io/platform
    expect(Cypress.platform).to.be.exist;
  });
});

context("Cypress.version", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/cypress-api");
  });

  it("Get current version of Cypress being run", () => {
    // https://on.cypress.io/version
    expect(Cypress.version).to.be.exist;
  });
});

context("Cypress.spec", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/cypress-api");
  });

  it("Get current spec information", () => {
    // https://on.cypress.io/spec
    // wrap the object so we can inspect it easily by clicking in the command log
    cy.wrap(Cypress.spec).should("include.keys", [
      "name",
      "relative",
      "absolute",
    ]);
  });
});
