const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Reservation = require('../models/Reservation');
const Table = require('../models/Table');
const RestaurantSettings = require('../models/RestaurantSettings');
const { ROLES } = require('../constants/roles');

const categories = [
    { name: 'Starters', description: 'Small plates to begin your journey', order: 1 },
    { name: 'Mains', description: 'Wood-fired & farm-to-table centerpieces', order: 2 },
    { name: 'Desserts', description: 'Handcrafted sweets & aged cheeses', order: 3 },
    { name: 'Cocktails', description: 'Artisanal cocktails with botanical notes', order: 4 },
    { name: 'Wines', description: 'Curated organic & biodynamic wines', order: 5 },
    { name: 'Non-Alcoholic', description: 'Zero-proof elixirs and teas', order: 6 },
];

const menuItems = [
    {
        name: 'Burrata & Heirloom Tomato',
        category: 'Starters',
        price: 18,
        description: 'Creamy burrata with heirloom tomatoes, aged balsamic, fresh basil oil, and sea salt flakes.',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&auto=format',
        available: true,
        dietary: ['Vegetarian', 'Gluten-free'],
        prepTime: 8,
        rating: 4.8,
        reviews: 142,
        popular: true,
    },
    {
        name: 'Seared Scallops',
        category: 'Starters',
        price: 24,
        description: 'Hand-dived scallops, cauliflower purée, crispy capers, and preserved lemon butter.',
        image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&h=400&fit=crop&auto=format',
        available: true,
        dietary: ['Gluten-free'],
        prepTime: 12,
        rating: 4.9,
        reviews: 98,
    },
    {
        name: 'Oak-Smoked Duck Breast',
        category: 'Mains',
        price: 42,
        description: 'Slow-smoked duck breast, cherry gastrique, roasted celeriac, pickled red cabbage.',
        image: 'https://images.unsplash.com/photo-1546039907-7fa05f864c02?w=600&h=400&fit=crop&auto=format',
        available: true,
        dietary: ['Gluten-free'],
        prepTime: 22,
        rating: 4.9,
        reviews: 201,
        popular: true,
    },
    {
        name: 'Pan-Seared Halibut',
        category: 'Mains',
        price: 38,
        description: 'Line-caught halibut, saffron beurre blanc, asparagus, kohlrabi, and herb oil.',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&h=400&fit=crop&auto=format',
        available: true,
        dietary: ['Gluten-free'],
        prepTime: 18,
        rating: 4.7,
        reviews: 134,
    },
    {
        name: 'Smoked Vanilla Panna Cotta',
        category: 'Desserts',
        price: 14,
        description: 'Madagascar vanilla, roasted blackberry compote, hazelnut crumble.',
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&h=400&fit=crop&auto=format',
        available: true,
        dietary: ['Vegetarian'],
        prepTime: 6,
        rating: 4.8,
        reviews: 89,
    },
];

const users = [
    {
        name: 'Priya Sharma',
        email: 'priya@example.com',
        password: 'password123',
        role: ROLES.CUSTOMER,
        loyaltyPoints: 1240,
        avatar: 'PS',
        preferences: ['Window seat', 'Quiet section'],
        dietary: ['Vegetarian'],
    },
    {
        name: 'Marcus Chen',
        email: 'marcus@emberandoak.com',
        password: 'staffpass',
        role: ROLES.MANAGER,
        loyaltyPoints: 0,
        avatar: 'MC',
    },
    {
        name: 'Isabelle Fontaine',
        email: 'isabelle@emberandoak.com',
        password: 'staffpass',
        role: ROLES.CHEF,
        loyaltyPoints: 0,
        avatar: 'IF',
    },
    {
        name: 'Alex Rivera',
        email: 'alex@emberandoak.com',
        password: 'staffpass',
        role: ROLES.WAITER,
        loyaltyPoints: 0,
        avatar: 'AR',
    },
];

const tables = [
    { number: 1, capacity: 2, status: 'occupied', zone: 'indoor', seatedAt: '19:15' },
    { number: 2, capacity: 4, status: 'reserved', zone: 'indoor', reservation: { name: 'Dr. Evelyn Vance', time: '20:00', party: 4 } },
    { number: 3, capacity: 4, status: 'available', zone: 'indoor' },
    { number: 4, capacity: 6, status: 'available', zone: 'indoor' },
    { number: 5, capacity: 2, status: 'occupied', zone: 'outdoor', seatedAt: '19:30' },
    { number: 6, capacity: 8, status: 'reserved', zone: 'private', reservation: { name: 'Harrison Tech Group', time: '20:30', party: 8 } },
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ember_oak');
        console.log('🌱 Connected to MongoDB for Seeding...');

        await User.deleteMany();
        await Category.deleteMany();
        await MenuItem.deleteMany();
        await Table.deleteMany();
        await Order.deleteMany();
        await Reservation.deleteMany();
        await RestaurantSettings.deleteMany();

        console.log('🧹 Existing data cleared.');

        await Category.insertMany(categories);
        console.log('✅ Categories seeded');

        await MenuItem.insertMany(menuItems);
        console.log('✅ Menu items seeded');

        for (const u of users) {
            await User.create(u);
        }
        console.log('✅ Users seeded');

        await Table.insertMany(tables);
        console.log('✅ Tables seeded');

        await RestaurantSettings.create({
            name: 'Ember & Oak',
            tagline: 'Farm-to-table dining, elevated.',
            phone: '+1 (555) 234-5678',
            email: 'concierge@emberandoak.com',
        });
        console.log('✅ Restaurant Settings seeded');

        console.log('🎉 Database seeding complete!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedData();
