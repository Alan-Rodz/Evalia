import { NextRequest } from 'next/server';

import { logErrorWithData } from '@/common/request/error';
import { createCheckRateLimitOptions, createRateLimiter } from '@/common/request/rateLimit';
import { RequestHandler } from '@/common/request/RequestHandler';
import { LogErrorData, LogErrorResponseData } from '@/common/schema/misc/error';

// ********************************************************************************
// == Constant ====================================================================
const CHECK_RATE_LIMIT_OPTIONS = createCheckRateLimitOptions('log');
const LIMITER = createRateLimiter();

// == POST ========================================================================
// log a client error in the server
export const POST = async (req: NextRequest) => RequestHandler.handleRequestOnServer<LogErrorData, LogErrorResponseData>(
 req,
 LIMITER,
 CHECK_RATE_LIMIT_OPTIONS,
 null,
 async (body) => {
  logErrorWithData(body);
  return true/*successfully logged*/;
 }
);
