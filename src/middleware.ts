import  { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
    const xfp = req.headers.get("x-forwarded-proto"); 
    const isHttps = xfp?.indexOf("https") !== -1;

    // TODO (pdakin): Think through the GoDaddy redirect case. Do we need to force www?
    if (process.env.NODE_ENV === "production" && !isHttps)
    {

        return NextResponse.redirect(
            `https://${req.headers.get('host')}${req.nextUrl.pathname}`,
            301
         );
    }

    return NextResponse.next();
}