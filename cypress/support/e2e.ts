import './commands';

// ********************************************************************************
// == Event =======================================================================
Cypress.on('uncaught:exception', (err) => {
 // this will throw an error by NextJS design
 // REF: https://github.com/vercel/next.js/issues/49298#issuecomment-1542055642
 if (err.message.includes('NEXT_REDIRECT')) {
  return false/*do not fail the test*/;
 } else /*fail the test and prevent others from running*/ {
  cy.log('uncaught:exception', err.message);
  cy.task('checkForInterrupt');
 }
});
