export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api', 
  stripePublicKey: process.env['NG_APP_STRIPE_PUBLIC_KEY'] || ''
};
