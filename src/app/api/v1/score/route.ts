import { GoogleAuth } from 'google-auth-library';
import Redis from 'ioredis';
import { NextRequest } from 'next/server';

import { serverErrorLogic } from '@/common/request/error';
import { createCheckRateLimitOptions, createRateLimiter } from '@/common/request/rateLimit';
import { RequestHandler } from '@/common/request/RequestHandler';
import { RequestMethod } from '@/common/request/type';
import { FullCandidate } from '@/common/schema/entity/candidate/type';
import { Job } from '@/common/schema/entity/job/type';
import { PostScoreData, PostScoreResponseData, postScoreSchema } from '@/common/schema/entity/score/api/post';
import { hashString } from '@/common/util/string';

import { readCandidateDb } from './readCandidateDb';

// ********************************************************************************
// == Type ========================================================================
type GoogleCloudPostScoreData = PostScoreData & {
 candidates: {
  educations: FullCandidate['educations'];
  experiences: FullCandidate['experiences'];
  qa: FullCandidate['qa'];
  skills: FullCandidate['skills'];
  summary: FullCandidate['summary'];
 }[];
}


// == Constant ====================================================================
const CHECK_RATE_LIMIT_OPTIONS = createCheckRateLimitOptions('score');
const LIMITER = createRateLimiter();
const ENDPOINT_URL = process.env.NODE_ENV === 'production'
 ? process.env.GOOGLE_CLOUD_RUN_SCORE_CANDIDATES_BACKEND_URL!
 : 'http://localhost:8080';
export const maxDuration = 60/*seconds, max allowed by hobby plan*/;
const MAX_RETURNED_CANDIDATES = 30;

// == POST ========================================================================
export const POST = async (req: NextRequest) => RequestHandler.handleRequestOnServer<PostScoreData, PostScoreResponseData>(
 req,
 LIMITER,
 CHECK_RATE_LIMIT_OPTIONS,
 postScoreSchema,
 async (body) => {
  const { job_description } = body;
  console.log(`POST /api/v1/score -- job_description: ${job_description}`);
  const redis = new Redis(process.env.REDIS_URL!);
  const redisKey = getRedisKeyFromJobDescription(job_description);

  try {
   const redisValue = await redis.get(redisKey);
   if (redisValue) {
    console.debug(`Redis cache hit for ${redisKey}`);
    const data = JSON.parse(redisValue) as PostScoreResponseData;
    const sortedCandidates = data.sort((a, b) => b.score - a.score).slice(0, MAX_RETURNED_CANDIDATES);
    return sortedCandidates;
   } /* else -- not found */

   const fullCandidates = readCandidateDb();
   const inputData: GoogleCloudPostScoreData = {
    candidates: fullCandidates.map((candidate) => ({
     educations: candidate.educations,
     experiences: candidate.experiences,
     qa: candidate.qa,
     skills: candidate.skills,
     summary: candidate.summary,
    })),
    job_description,
   }
   console.debug(`Calling Google Cloud Function`);
   const credentials = JSON.parse(Buffer.from(process.env.GOOGLE_CLOUD_SERVICE_ACCOUNT_B64_CREDENTIALS!, 'base64').toString());
   const auth = new GoogleAuth({ credentials });
   const client = await auth.getIdTokenClient(ENDPOINT_URL);
   const res = await client.request<PostScoreResponseData>({
    data: inputData,
    method: RequestMethod.POST,
    url: ENDPOINT_URL,
   });
   const data = res.data as PostScoreResponseData;
   const sortedCandidates = data.sort((a, b) => b.score - a.score).slice(0, MAX_RETURNED_CANDIDATES);

   redis.set(redisKey, JSON.stringify(sortedCandidates), 'EX', process.env.REDIS_CACHE_TTL_SECONDS ?? (60/*seconds*/ * 10));

   return sortedCandidates;
  } catch (error) {
   await serverErrorLogic(error, 'Error calling Google Cloud Function');
   return [];
  } finally {
   redis.quit();
  }
 }
);

// == Util ========================================================================
const getRedisKeyFromJobDescription = (job_description: Job['description']) =>
 `score:${hashString(job_description)}`;
