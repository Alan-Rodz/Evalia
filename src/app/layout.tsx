import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';

// ********************************************************************************
// == Constant ====================================================================
export const metadata: Metadata = { description: 'Evaluate candidate profiles with AI', title: 'Evalia' };

// == Component ===================================================================
const RootLayout = ({ children }: PropsWithChildren) => {
 return (
  <html lang='en'>
   <body>
    {children}
   </body>
  </html>
 );
}

// == Export ======================================================================
export default RootLayout;
