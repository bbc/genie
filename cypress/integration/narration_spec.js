describe("The Genie narration page", () => {
    beforeEach(() => {
      cy.visit("https://www.test.bbc.co.uk/games/embed/genie?versionOverride=latest&viewNonPublished=true&cageEnv=test&debug=true")
      cy.get("#home__play", { timeout: 40000 }).should("exist")
      cy.get(".data-notice").click()
    });

    it("can skip the narration page", () => {
      cy.genieClick("#home__debug")
      cy.genieClick("#debug__debug-narrative")
      cy.genieClick("#debug-narrative__skip")
      cy.get("#debug__debug-narrative", { timeout: 20000 }).should("exist")
    });
    
    it("can proceed through each narration page", () => {
      cy.genieClick("#home__debug")
      cy.genieClick("#debug__debug-narrative")
      cy.genieClick("#debug-narrative__continue")
      cy.genieClick("#debug-narrative__continue")
      cy.genieClick("#debug-narrative__continue")
      cy.genieClick("#debug-narrative__continue")
      cy.genieClick("#debug-narrative__continue")
      cy.get("#debug__debug-narrative", { timeout: 20000 }).should("exist")
    });

    it("can pause the game on the narration page", () => {
      cy.genieClick("#home__debug")
      cy.genieClick("#debug__debug-narrative")
      cy.genieClick("#debug-narrative__pause")
      cy.genieClick("#pause__play")
      cy.get("#debug-narrative__continue").should("exist")
      cy.get("#debug-narrative__skip").should("exist")
      cy.get("#debug-narrative__pause").should("exist")
    });
});


/* 
Use stats to confirm each page has navigated
https://logws1363.ati-host.net/hit.xiti?s=599454&idclient=017d32ec-0667-4a30-9b76-8c5c6aeb4805&t
s=1608636068499&vtag=5.17.1&ptag=js&r=1680x1050x24x24&re=1680x939&hl=11x21x8&lng=en-GB&atc=PUB-[
Page]-[narrative~continue]-[]-[PAG=3]-[keepalive.games.genie.debug_narrative.page]-[]-[narrative
-debug-narrative]-[unknown]&type=AT&patc=keepalive.games.genie.debug_narrative.page&s2atc=7
*/