// ********************************************************************************
// == Content Type ================================================================
export enum RequestContentType {
 Json = 'application/json',
 UrlEncoded = 'application/x-www-form-urlencoded',
 XML = 'application/xml',
}

// == Header ======================================================================
export enum RequestHeader {
 Authorization = 'authorization',
 ContentDisposition = 'content-disposition',
 ContentType = 'Content-Type',
 Cookie = 'Set-Cookie',
 CypressTest = 'Cypress-Test',
 FBSignature = 'x-hub-signature-256',
 Host = 'host',
 Origin = 'origin',
 Protocol = 'x-forwarded-proto',
 STSignature = 'stripe-signature',
 UserAgent = 'user-agent',

 // REF: https://vercel.com/changelog/ip-geolocation-for-serverless-functions
 VercelCity = 'X-Vercel-IP-City',
 VercelCountry = 'X-Vercel-IP-Country',
 VercelRegion = 'X-Vercel-IP-Country-Region',
 XRealIp = 'x-real-ip',
}

// == Request =====================================================================
export enum RequestMethod {
 DELETE = 'DELETE',
 GET = 'GET',
 HEAD = 'HEAD',
 PATCH = 'PATCH',
 POST = 'POST',
 PUT = 'PUT',
}
