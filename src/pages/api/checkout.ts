export const prerender = false;

import type { APIRoute } from 'astro';
import Stripe from 'stripe';

const PRICES = {
  monthly: 'price_1T5EfWKGlLR3mpMR9houthKj',
  annual: 'price_1T5EfXKGlLR3mpMRnEEjc49p',
};

export const POST: APIRoute = async ({ request }) => {
  const stripeKey = import.meta.env.STRIPE_SECRET_KEY?.trim();
  if (!stripeKey) {
    return new Response(JSON.stringify({ error: 'Stripe not configured' }), { status: 500 });
  }

  const stripe = new Stripe(stripeKey, { maxNetworkRetries: 2 });

  try {
    const { businessName, email, plan, demoSlug } = await request.json();

    if (!businessName || !email) {
      return new Response(
        JSON.stringify({ error: 'Business name and email are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'www.lakecountryweb.com';
    const proto = request.headers.get('x-forwarded-proto') || 'https';
    const origin = `${proto}://${host}`;
    const isAnnual = plan === 'annual';
    const priceId = isAnnual ? PRICES.annual : PRICES.monthly;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: email,
      metadata: {
        business_name: businessName,
        plan: isAnnual ? 'annual' : 'monthly',
        ...(demoSlug ? { demo_slug: demoSlug } : {}),
      },
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    const type = err instanceof Stripe.errors.StripeError ? err.type : 'unknown';
    console.error('Stripe checkout error:', { type, message: msg });
    return new Response(JSON.stringify({ error: msg, type }), { status: 500 });
  }
};
