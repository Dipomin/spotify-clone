import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server";

import { stripe } from "@/libs/stripe";
import { getURL } from "@/libs/helpers";
import { createOrRetrieveCustomer } from "@/libs/supabaseAdmin";

export async function POST() {
    try {
        const supabase = createRouteHandlerClient({
            cookies
        });

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) throw new Error("Impossible d'accéder à l'utilisateur");
        
        const customer = await createOrRetrieveCustomer({
            uuid: user.id || '',
            email: user.email || ''
        });

        if (!customer) throw new Error("Impossible d'accéder au client");

        const { url } = await stripe.billingPortal.sessions.create({
            customer,
            return_url: `${getURL()}/account`
        });

        return NextResponse.json({ url });
    } catch (error: any) {
        console.log(error);
        return new NextResponse('Erreur interne', {status: 500})
    }
};
