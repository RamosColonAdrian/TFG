describe("template spec", () => {
  it("passes", () => {
    cy.visit("http://localhost:4173");
    cy.get(".inline-block").click();
    cy.get("#name").type("Adrian");
    cy.get("#lastName").type("Ramos");
    cy.get("#email").type("elrubiurc@gmail.com");
    cy.get("#password").type("qwer");
    cy.get("#confirmPassword").type("qwer");
    cy.intercept(/register/,{
      statusCode:201
    });
    cy.get(".float-right").click();

    cy.contains("LOGIN")

    cy.get("#email").type("elrubiurc@gmail.com");
    cy.get("#password").type("qwer");
    cy.get(".px-4").click();
  });
});
