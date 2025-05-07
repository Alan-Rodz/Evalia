import { string } from 'yup';

// ********************************************************************************
// == Constant ====================================================================
export const STRING_SCHEMA_MIN_LENGTH = 1/*T&E*/;
const STRING_SCHEMA_MAX_LENGTH = 500/*T&E*/;

// == Type ========================================================================
type StringSchemaParams = {
 min?: number;
 max?: number;
};

// == Schema ======================================================================
const getNonRequiredStringSchema = (params: StringSchemaParams) => {
 const min = params?.min ?? STRING_SCHEMA_MIN_LENGTH;
 const max = params?.max ?? STRING_SCHEMA_MAX_LENGTH;

 return string()
  .min(min, `The string must be at least ${min} characters long`)
  .max(max, `The string must be at most ${max} characters long`);
};

export const getStringSchema = (params: StringSchemaParams) =>
 getNonRequiredStringSchema(params)
  .required('The string is required');
