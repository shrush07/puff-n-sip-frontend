import { Food } from "./app/shared/models/Food";
import { Tag } from "./app/shared/models/Tag";

export const sample_foods: Food[] =[
    {
        _id: '1',
        name: 'Coffee',
        price: 120.00,
        imageUrl: 'assets/images/coffee1.png',
        tags: ['Coffee'],
        favorite: false,
    },
    {
        _id: '2',
        name: 'Mocktail',
        price: 120.00,
        imageUrl: 'assets/images/juice1.png',
        tags: ['Mocktail'],
        favorite: false,
    },
    {
        _id: '3',
        name: 'Puff',
        price: 120.00,
        imageUrl: 'assets/images/puff1.png',
        tags: ['Puff'],
        favorite: false,
    },
    {
        _id: '4',
        name: 'Croisaant',
        price: 120.00,
        imageUrl: 'assets/images/croisaant1.png',
        tags: ['Croisaant'],
        favorite: true,
    },
    {
        _id: '5',
        name: 'Coffee',
        price: 120.00,
        imageUrl: 'assets/images/coffee2.png',
        tags: ['Coffee'],
        favorite: true,
    },
    {
        _id: '6',
        name: 'Burger',
        price: 120.00,
        imageUrl: 'assets/images/burger1png',
        tags: ['Burger'],
        favorite: true,
    },
    {
        _id: '7',
        name: 'Mocktail',
        price: 120.00,
        imageUrl: 'assets/images/juice2.png',
        tags: ['Mocktail'],
        favorite: true,
    },
    {
        _id: '8',
        name: 'Coffee',
        price: 120.00,
        imageUrl: 'assets/images/coffee3.png',
        tags: ['Coffee'],
        favorite: true,
    },
    {
        _id: '9',
        name: 'Croisaant',
        price: 120.00,
        imageUrl: 'assets/images/croisaant2.png',
        tags: ['Croisaant'],
        favorite: true,
    },
    {
        _id: '10',
        name: 'Puff',
        price: 120.00,
        imageUrl: 'assets/images/puff2.png',
        tags: ['Puff'],
        favorite: true,
    },
    {
        _id: '11',
        name: 'Coffee',
        price: 120.00,
        imageUrl: 'assets/images/coffee4.png',
        tags: ['Coffee'],
        favorite: true,
    },
]

export const sample_tags:any[] = [
    { name: 'All', count: 11 },
    { name: 'Coffee', count: 4 },
    { name: 'Mocktail', count: 2 },
    { name: 'Puff', count: 2 },
    { name: 'Burger', count: 1 },
    { name: 'Croisaant', count: 2}

]