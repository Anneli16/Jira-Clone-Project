describe("Issue delete", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");

        cy.contains("This is an issue of type: Task.").click();
      });
  });

  it("Should delete issue successfully", () => {
    cy.get('[data-testid="icon:trash"]').should("be.visible").click();
    cy.get('[data-testid="modal:confirm"]')
      .should("be.visible")
      .within(() => {
        cy.get("button").contains("Delete issue").should("be.visible").click();

        cy.get('[data-testid="modal:confirm"]').should("not.exist");
        getIssueDetailsModal().should("not.exist");
      });
  });

  it("Should cancel deletion process successfully", () => {
    getIssueDetailsModal.should("be.visible");

    // Click the Delete Issue button
    cy.get('[data-testid="icon:trash"]').should("be.visible").click();

    // Cancel the deletion in the confirmation pop-up
    cy.get('[data-testid="modal:confirm"]')
      .should("be.visible")
      .within(() => {
        cy.contains("button", "Cancel").should("be.visible").click();
      });

    // Assert that the deletion confirmation dialogue is not visible
    cy.get('[data-testid="modal:confirm"]').should("not.exist");

    // Assert that the issue detail view modal is still visible
    cy.get('[data-testid="modal:issue-details"]').should("be.visible");

    // Close the issue detail modal
    cy.get('[data-testid="icon:close"]').first().should("be.visible").click();

    // Assert that the issue is still displayed on the Jira board
    cy.get('[data-testid="board-list:backlog"]').should("be.visible");
    cy.get('[data-testid="list-issue"]').first().should("be.visible");
  });
});
const getIssueDetailsModal = () =>
  cy.get('[data-testid="modal:issue-details"]');
