// ********************************************************************************
export type RequestResponse<T> = { data: T | null/*could not complete the operation*/; status: ResponseStatus; }

export enum ResponseStatus {
 BAD_REQUEST = 400,
 CREATED = 201,
 ERROR = 500,
 FORBIDDEN = 403,
 METHOD_NOT_ALLOWED = 405,
 NOT_FOUND = 404,
 RATE_LIMIT_EXCEEDED = 429,
 SUCCESS = 200,
 UNAUTHORIZED = 401,
}

