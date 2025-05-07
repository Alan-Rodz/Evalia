import { object } from 'yup';

import { getStringSchema } from '@/common/schema/misc/string';

import { FullCandidate, ScoredCandidate } from '../../candidate/type';
import { Job } from '../../job/type';

// ********************************************************************************
// == Type ========================================================================
export type PostScoreData = { job_description: Job['description']; }

export type GoogleCloudRunPostScoreData = PostScoreData & {
 candidates: {
  educations: FullCandidate['educations'];
  experiences: FullCandidate['experiences'];
  qa: FullCandidate['qa'];
  skills: FullCandidate['skills'];
  summary: FullCandidate['summary'];
 }[];
}

export type PostScoreResponseData = ScoredCandidate[];

// == Constant ====================================================================
export const SCORE_DESCRIPTION_MAX_LENGTH = 200;
const SCORE_DESCRIPTION_MIN_LENGTH = 1;

export const postScoreSchemaKeys: { [key in keyof PostScoreData]: key; } = { job_description: 'job_description' };

// == Schema ======================================================================
export const postScoreSchema =
 object()
  .typeError('The request body must be an object')
  .shape({
   [postScoreSchemaKeys.job_description]: getStringSchema({ max: SCORE_DESCRIPTION_MAX_LENGTH, min: SCORE_DESCRIPTION_MIN_LENGTH }),
  })
  .required('The request body is required');
