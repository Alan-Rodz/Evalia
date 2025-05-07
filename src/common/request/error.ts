import { webRouter } from '../route';
import { LogErrorData, LogErrorResponseData } from '../schema/misc/error';
import { RequestHandler } from './RequestHandler';
import { RequestMethod } from './type';

// ********************************************************************************
export const clientErrorLogic = async (error: unknown, descriptiveSource: LogErrorData['descriptiveSource']) => {
 console.error(error);
 const data = getLogErrorDataFromError(error, descriptiveSource);
 await RequestHandler.makeRequest<LogErrorData, LogErrorResponseData>(RequestMethod.POST, webRouter.api.v1.log, data);
};

export const serverErrorLogic = async (error: unknown, descriptiveSource: LogErrorData['descriptiveSource']) =>
 logErrorWithData(getLogErrorDataFromError(error, descriptiveSource));

export const logErrorWithData = (data: LogErrorData) => {
 const { descriptiveSource, message, name, stack } = data;
 console.error(`Logged error - Name: (${name}) - Descriptive Source: (${descriptiveSource ? descriptiveSource : 'Unavailable'}) - Message: (${message}) -  Stack: {${stack}}`);
};

// == Util ========================================================================
const getLogErrorDataFromError = (error: unknown, descriptiveSource: LogErrorData['descriptiveSource']): LogErrorData => {
 let message = '';
 let name = '';
 let stack = '';

 if (error instanceof Error) {
  message = error.message;
  name = error.name;
  stack = error.stack ?? '';
 } else {
  message = 'Unknown error';
  name = 'Unknown error';
  stack = `${JSON.stringify(error)}`;
 }

 return { descriptiveSource, message, name, stack };
};
