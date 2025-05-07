
// ********************************************************************************
export type LogErrorData = {
 descriptiveSource: string;
 message: string;
 name: string;
 stack: string;
};

export type LogErrorResponseData = boolean/*whether the error was correctly logged or not*/;
