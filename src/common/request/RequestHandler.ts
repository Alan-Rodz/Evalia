import axios, { AxiosResponse } from 'axios';
import { Schema } from 'yup';

import { CheckRateLimitProps, RateLimiter } from './rateLimit';
import { ResponseStatus } from './response/type';
import { RequestMethod } from './type';

// ********************************************************************************
// == Class =======================================================================
export class RequestHandler {
 // -- Request -------------------------------------------------------------------
 static async makeRequest<RequestInputData, RequestResponseData>(method: RequestMethod, route: string, data: RequestInputData): Promise<RequestResponseData | null> {
  try {
   let response: AxiosResponse<RequestResponseData> | null = null;

   switch (method) {
    case RequestMethod.DELETE: response = await axios.delete(route, { data }); break;
    case RequestMethod.GET: response = await axios.get(route); break;
    case RequestMethod.PATCH: response = await axios.patch(route, data); break;
    case RequestMethod.POST: response = await axios.post(route, data); break;
    case RequestMethod.PUT: response = await axios.put(route, data); break;
    default: throw new Error(`Unknown method: ${method}`);
   }
   if (!response) { return null/*no response*/; }

   return response.data;
  } catch (error) {
   this.logRequestError(error, `Error while handling request for method: ${method}: ${error}`);
   return null/*no response*/;
  }
 }

 static async handleRequestOnServer<RequestData, RequestResponse>(
  req: Request,
  limiter: RateLimiter,
  checkRateLimitProps: CheckRateLimitProps,
  schema: Schema | null,
  logicHandler: (body: RequestData) => Promise<RequestResponse>
 ) {
  // -- check rate limit --------------------------------------------------------
  const rateLimitHeaders = limiter.check(checkRateLimitProps);
  if (rateLimitHeaders['X-RateLimit-Remaining'] === '0') { return RequestHandler.returnErrorResponse('Rate limit exceeded'); }

  let body = {};
  try { body = await req.json(); }
  catch { body = {/*empty body*/ }; }

  // -- ensure request is valid -------------------------------------------------
  if ((schema !== null) && !schema.isValidSync(body)) {
   return RequestHandler.returnBadRequestResponse('Invalid request');
  } /* else -- validated*/

  // -- handle request ----------------------------------------------------------
  try {
   const result = await logicHandler(body as RequestData/*guaranteed by schema*/);
   return RequestHandler.returnSuccessResponse<RequestResponse>(result, rateLimitHeaders);
  } catch (error) {
   console.debug(`Uncaught error while handling request on server: (${(error as Error).message})`);
   return RequestHandler.returnErrorResponse(`Something went wrong on API call: (${(error as Error).message})`);
  }
 }

 // -- Response ------------------------------------------------------------------
 static returnSuccessResponse<T>(returnedObj: T, headers: HeadersInit) {
  const res = new Response(JSON.stringify(returnedObj), { headers, status: ResponseStatus.SUCCESS });

  return res;
 }

 static returnErrorResponse(message: string) {
  const res = new Response(JSON.stringify({ status: ResponseStatus.ERROR, message }), { status: ResponseStatus.ERROR });
  return res;
 }

 static returnBadRequestResponse(message: string) {
  const res = new Response(JSON.stringify({ status: ResponseStatus.BAD_REQUEST, message }), { status: ResponseStatus.BAD_REQUEST });
  return res;
 }

 // .. Util ......................................................................
 static logRequestError(error: unknown, errorSource: string) {
  if (axios.isAxiosError(error)) console.warn(`Axios error (${errorSource}): (${JSON.stringify(error.response?.data.message)})`);
  else console.warn(`Unexpected error (${errorSource}): (${error})`);
 }
}
