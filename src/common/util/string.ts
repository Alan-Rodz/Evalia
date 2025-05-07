// ********************************************************************************
export const hashString = (s: string) =>
 s
  .split('')
  .reduce((acc, char) => {
   const charCode = char.charCodeAt(0);
   return (acc << 5) - acc + charCode;
  }, 0)
  .toString(16)
  .slice(0, 8);

export const isBlankString = (s: string) => {
 if (!s) { return true; }
 return s.trim() === '';
};
