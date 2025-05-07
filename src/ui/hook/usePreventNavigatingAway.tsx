import { useEffect, useState } from 'react';

// ********************************************************************************
// REF:  https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event#compatibility_notes

// == Hook ========================================================================
export const usePreventNavigatingAway = () => {
 // -- State ---------------------------------------------------------------------
 const [preventNavigatingAway, setPreventNavigatingAway] = useState(false);

 // -- Effect --------------------------------------------------------------------
 useEffect(() => {
  const prevent = (event: BeforeUnloadEvent) => {
   if (!preventNavigatingAway) { return/*no need to warn*/; }

   event.preventDefault();
  };
  window.addEventListener('beforeunload', prevent);

  return () => { window.removeEventListener('beforeunload', prevent); };
 }, [preventNavigatingAway]);

 // --------------------------------------------------------------------------------
 return { preventNavigatingAway, setPreventNavigatingAway };
};
