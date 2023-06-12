import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { supabase } from "@supabase/auth-ui-shared";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({
        req,
        res
    });

await supabase.auth.getSession();
return res;

};