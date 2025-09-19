import { CartItem } from "./CartItem";

export type OrderType = 'online' | 'instore';

export class Order{
    _id?: string;
    items!: { 
        food: {
            _id: string;
            name: string;
            price: number;
            imageUrl: string;
        }; 
        price: number;
        quantity: number;
    }[];
    totalPrice!: number;
    name!: string; 
    address!: string;
    imageUrl!: string; 
    orderType!: OrderType; // Added to match backend
    paymentId!: string;
    status!: string;
    clientSecret?: string; // optional for Stripe
    createdAt!: string;
    // addressLatLng?:LatLng
    // postalcode!: string;
}
