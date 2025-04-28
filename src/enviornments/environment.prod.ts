export const environment = {
  production: true,
  apiUrl: process.env['API_URL'], 
  stripePublicKey: process.env['STRIPE_PUBLIC_KEY'],
  stripeSecretKey: process.env['STRIPE_SECRET_KEY']
};
