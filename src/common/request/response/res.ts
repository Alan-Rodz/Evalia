import { NextResponse } from 'next/server';
import { Schema } from 'yup';

import { ResponseStatus } from './type';

// ********************************************************************************
// == Class =======================================================================
export class BadRequestError extends Error {
 constructor(message = 'Invalid Request') {
  super(message);
  this.name = 'BadRequestError';
 }
}

// == Util ========================================================================
export const badRequestResponse = NextResponse.json(null/*no body*/, { status: ResponseStatus.BAD_REQUEST, statusText: 'Bad request' });

export const errorResponse = (message: string) => NextResponse.json(null/*no body*/, { status: ResponseStatus.ERROR, statusText: message });

export const getBadRequestError = () => new BadRequestError();

export const rateLimitExceededResponse = NextResponse.json(null/*no body*/, { status: ResponseStatus.RATE_LIMIT_EXCEEDED, statusText: 'Request limit exceeded' });

export const successResponse = <T>(data: T) => NextResponse.json(data, { status: ResponseStatus.SUCCESS });

export const unauthorizedResponse = NextResponse.json(null/*no body*/, { status: ResponseStatus.UNAUTHORIZED, statusText: 'Unauthorized usage of API endpoint' });

export const validateOrReturnBadRequest = async (body: unknown, schema: Schema): Promise<NextResponse | undefined> => {
 if (typeof body !== 'object' || body === null || Object.keys(body).length === 0) {
  console.log('BODY MAN', body);
  return badRequestResponse;
 } /* else -- valid */

 const isValid = schema.isValidSync(body);
 if (!isValid) {
  return badRequestResponse;
 } /* else -- valid */

};
