import { ResponseStatus } from '@/common/request/response/type';
import { RequestMethod } from '@/common/request/type';
import { webRouter } from '@/common/route';
import { postScoreSchemaKeys, SCORE_DESCRIPTION_MAX_LENGTH } from '@/common/schema/entity/score/api/post';

// ********************************************************************************
describe('POST /api/v1/route', () => {
 const url = webRouter.api.v1.score;
 const method = RequestMethod.POST;

 it('returns success for valid input', () => {
  cy.request({
   body: { [postScoreSchemaKeys.job_description]: 'This is a valid job description' },
   failOnStatusCode: false,
   method,
   url,
  }).then((response) => {
   expect(response.status).to.equal(ResponseStatus.SUCCESS);
   expect(response.body).to.be.an('array')
  });
 });

 it('returns 400 for missing body', () => {
  cy.request({
   body: {},
   url,
   method,
   failOnStatusCode: false,
  }).then((response) => {
   expect(response.status).to.equal(ResponseStatus.BAD_REQUEST);
  });
 });

 it('returns 400 for over-length description', () => {
  const longDescription = 'a'.repeat(SCORE_DESCRIPTION_MAX_LENGTH + 1);

  cy.request({
   body: { job_description: longDescription },
   url,
   method,
   failOnStatusCode: false,
  }).then((response) => {
   expect(response.status).to.equal(ResponseStatus.BAD_REQUEST);
  });
 });
});
