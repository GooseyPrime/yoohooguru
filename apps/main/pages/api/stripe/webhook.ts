import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import escapeHtml from 'escape-html';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const buffer = (req: NextApiRequest) => {
  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Buffer[] = [];
    
    req.on('data', (chunk) => {
      chunks.push(chunk);
    });
    
    req.on('end', () => {
      resolve(Buffer.concat(chunks));
    });
    
    req.on('error', reject);
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }
  
  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
  let event: Stripe.Event;
  
  try {
    if (!sig || !webhookSecret) {
      throw new Error('Missing stripe signature or webhook secret');
    }
    
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Webhook signature verification failed.', errorMessage);
    res.status(400).send(`Webhook Error: ${escapeHtml(errorMessage)}`);
    return;
  }
  
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {
      // const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('PaymentIntent was successful!');
      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    }
    
    case 'payment_intent.payment_failed': {
      // const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log('PaymentIntent failed!');
      // Then define and call a method to handle the failed payment intent.
      // handlePaymentIntentFailed(paymentIntent);
      break;
    }
    
    case 'charge.succeeded': {
      // const charge = event.data.object as Stripe.Charge;
      console.log('Charge succeeded!');
      // Then define and call a method to handle the successful charge.
      // handleChargeSucceeded(charge);
      break;
    }
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  
  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ received: true });
}