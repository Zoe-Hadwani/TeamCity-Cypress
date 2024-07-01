/// <reference types="cypress" />

context("Utilities", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/utilities");
  });

  it("Cypress._ - call a lodash method", () => {
    // https://on.cypress.io/_
    cy.request("https://jsonplaceholder.cypress.io/users").then((response) => {
      let ids = Cypress._.chain(response.body).map("id").take(3).value();

      expect(ids).to.deep.eq([1, 2, 3]);
    });
  });

  it("Cypress.$ - call a jQuery method", () => {
    // https://on.cypress.io/$
    let $li = Cypress.$(".utility-jquery li:first");

    cy.wrap($li)
      .should("not.have.class", "active")
      .click()
      .should("have.class", "active");
  });

  it("Cypress.Blob - blob utilities and base64 string conversion", () => {
    // https://on.cypress.io/blob
    cy.get(".utility-blob").then(($div) => {
      // https://github.com/nolanlawson/blob-util#imgSrcToDataURL
      // get the dataUrl string for the javascript-logo
      return Cypress.Blob.imgSrcToDataURL(
        "https://example.cypress.io/assets/img/javascript-logo.png",
        undefined,
        "anonymous"
      ).then((dataUrl) => {
        // create an <img> element and set its src to the dataUrl
        let img = Cypress.$("<img />", { src: dataUrl });

        // need to explicitly return cy here since we are initially returning
        // the Cypress.Blob.imgSrcToDataURL promise to our test
        // append the image
        $div.append(img);

        cy.get(".utility-blob img").click().should("have.attr", "src", dataUrl);
      });
    });
  });

  it("Cypress.minimatch - test out glob patterns against strings", () => {
    // https://on.cypress.io/minimatch
    let matching = Cypress.minimatch("/users/1/comments", "/users/*/comments", {
      matchBase: true,
    });

    expect(matching, "matching wildcard").to.be.true;

    matching = Cypress.minimatch("/users/1/comments/2", "/users/*/comments", {
      matchBase: true,
    });

    expect(matching, "comments").to.be.false;

    // ** matches against all downstream path segments
    matching = Cypress.minimatch("/foo/bar/baz/123/quux?a=b&c=2", "/foo/**", {
      matchBase: true,
    });

    expect(matching, "comments").to.be.true;

    // whereas * matches only the next path segment

    matching = Cypress.minimatch("/foo/bar/baz/123/quux?a=b&c=2", "/foo/*", {
      matchBase: false,
    });

    expect(matching, "comments").to.be.false;
  });

  it("Cypress.Promise - instantiate a bluebird promise", () => {
    // https://on.cypress.io/promise
    let waited = false;

    /**
     * @return Bluebird<string>
     */
    function waitOneSecond() {
      // return a promise that resolves after 1 second
      return new Cypress.Promise((resolve, reject) => {
        setTimeout(() => {
          // set waited to true
          waited = true;

          // resolve with 'foo' string
          resolve("foo");
        }, 1000);
      });
    }

    cy.then(() => {
      // return a promise to cy.then() that
      // is awaited until it resolves
      return waitOneSecond().then((str) => {
        expect(str).to.eq("foo");
        expect(waited).to.be.true;
      });
    });
  });
});

/// <reference types="cypress" />

context("Viewport", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/commands/viewport");
  });

  it("cy.viewport() - set the viewport size and dimension", () => {
    // https://on.cypress.io/viewport

    cy.get("#navbar").should("be.visible");
    cy.viewport(320, 480);

    // the navbar should have collapse since our screen is smaller
    cy.get("#navbar").should("not.be.visible");
    cy.get(".navbar-toggle").should("be.visible").click();
    cy.get(".nav").find("a").should("be.visible");

    // lets see what our app looks like on a super large screen
    cy.viewport(2999, 2999);

    // cy.viewport() accepts a set of preset sizes
    // to easily set the screen to a device's width and height

    // We added a cy.wait() between each viewport change so you can see
    // the change otherwise it is a little too fast to see :)

    cy.viewport("macbook-15");
    cy.wait(200);
    cy.viewport("macbook-13");
    cy.wait(200);
    cy.viewport("macbook-11");
    cy.wait(200);
    cy.viewport("ipad-2");
    cy.wait(200);
    cy.viewport("ipad-mini");
    cy.wait(200);
    cy.viewport("iphone-6+");
    cy.wait(200);
    cy.viewport("iphone-6");
    cy.wait(200);
    cy.viewport("iphone-5");
    cy.wait(200);
    cy.viewport("iphone-4");
    cy.wait(200);
    cy.viewport("iphone-3");
    cy.wait(200);

    // cy.viewport() accepts an orientation for all presets
    // the default orientation is 'portrait'
    cy.viewport("ipad-2", "portrait");
    cy.wait(200);
    cy.viewport("iphone-4", "landscape");
    cy.wait(200);

    // The viewport will be reset back to the default dimensions
    // in between tests (the  default can be set in cypress.json)
  });
});
/// <reference types="cypress" />

context("Window", () => {
  beforeEach(() => {
    cy.visit("https://example.cypress.io/commands/window");
  });

  it("cy.window() - get the global window object", () => {
    // https://on.cypress.io/window
    cy.window().should("have.property", "top");
  });

  it("cy.document() - get the document object", () => {
    // https://on.cypress.io/document
    cy.document().should("have.property", "charset").and("eq", "UTF-8");
  });

  it("cy.title() - get the title", () => {
    // https://on.cypress.io/title
    cy.title().should("include", "Kitchen Sink");
  });
});
