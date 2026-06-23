import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import { Event } from '../models/event.schema.js'; // Adjusted path
import { User } from '../models/user.schema.js';   // Adjusted path
import { Ticket } from '../models/ticket.schema.js'
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup for ES Modules to find the .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// This looks for the .env file in your root 'server' folder
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in .env file");
        }

        console.log("Connecting to Database...");
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("🚀 Database Connected...");

        // 1. DELETE OLD DATA
        await User.deleteMany({});
        await Event.deleteMany({});
        await Ticket.deleteMany({});
        console.log("🧹 Old data cleared.");

        // 2. CREATE USERS
        const users = [];
        for (let i = 0; i < 5; i++) {
            users.push({
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: "password123", 
            });
        }
        const createdUsers = await User.insertMany(users);
        console.log(`👤 ${createdUsers.length} Users created.`);

        // 3. CREATE EVENTS
        const categories = ["Music", "Tech", "Arts", "Sports", "Business"];
        const cities = ["Mumbai", "Delhi", "Bangalore", "Pune", "Goa"];
        const eventImages = [
            "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
            "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800",
            "https://images.unsplash.com/photo-1558008258-3256797b43f3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGV2ZW50fGVufDB8fDB8fHww",
            "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800",
            "https://images.unsplash.com/photo-1560439514-4e9645039924?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        ];

        const events = [];
        for (let i = 0; i < 20; i++) {
            const isOnline = faker.datatype.boolean(0.3);
            
            events.push({
                title: faker.company.catchPhrase(),
                description: faker.lorem.paragraphs(2),
                bannerImage: faker.helpers.arrayElement(eventImages),
                bannerImagePublicId: `seed_${faker.string.alphanumeric(10)}`,
                type: isOnline ? "ONLINE" : "OFFLINE",
                category: faker.helpers.arrayElement(categories),
                location: isOnline ? null : faker.location.streetAddress(),
                city: isOnline ? null : faker.helpers.arrayElement(cities),
                platform: isOnline ? "Zoom" : null,
                meetingLink: isOnline ? faker.internet.url() : "",
                startDate: faker.date.soon({ days: 10 }),
                endDate: faker.date.soon({ days: 11 }),
                price: faker.helpers.arrayElement([0, 299, 499, 999, 1999]),
                capacity: faker.number.int({ min: 10, max: 100 }),
                ticketSold: 0,
                status: "PUBLISHED",
                organiserId: faker.helpers.arrayElement(createdUsers)._id,
                tags: [faker.word.adjective(), "2025"],
                isFeatured: faker.datatype.boolean(0.2)
            });
        }

        await Event.insertMany(events);
        console.log("🎉 20 Diverse Events Seeded Successfully!");

        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding Failed:", error);
        process.exit(1);
    }
};

seedDB();