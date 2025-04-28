// In environment.ts for the frontend
export const environment = {
  production: false,
  apiUrl: process.env.API_URL, 
  stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY
};
