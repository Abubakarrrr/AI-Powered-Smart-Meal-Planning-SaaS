import { config } from "dotenv";
import connectDB from "db/db";
import User from "models/Meal";

config();

const seedUsers = [
  // Female Users
  {
    email: "emma.thompson@example.com",
    name: "Emma Thompson",
    password: "123456",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    role: "nutritionist",
  },
  {
    email: "olivia.miller@example.com",
    name: "Olivia Miller",
    password: "123456",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    role: "nutritionist",
  },
  {
    email: "sophia.davis@example.com",
    name: "Sophia Davis",
    password: "123456",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    role: "nutritionist",
  },
  {
    email: "ava.wilson@example.com",
    name: "Ava Wilson",
    password: "123456",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    role: "nutritionist",
  },
  {
    email: "isabella.brown@example.com",
    name: "Isabella Brown",
    password: "123456",
    avatar: "https://randomuser.me/api/portraits/women/5.jpg",
    role: "nutritionist",
  },
  {
    email: "mia.johnson@example.com",
    name: "Mia Johnson",
    password: "123456",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    role: "nutritionist",
  },
  {
    email: "charlotte.williams@example.com",
    name: "Charlotte Williams",
    password: "123456",
    avatar: "https://randomuser.me/api/portraits/women/7.jpg",
    role: "nutritionist",
  },
  {
    email: "amelia.garcia@example.com",
    name: "Amelia Garcia",
    password: "123456",
    avatar: "https://randomuser.me/api/portraits/women/8.jpg",
    role: "nutritionist",
  },

  // Male Users
  {
    email: "james.anderson@example.com",
    name: "James Anderson",
    password: "123456",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    role: "nutritionist",
  },
  {
    email: "william.clark@example.com",
    name: "William Clark",
    password: "123456",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    role: "nutritionist",
  },
  {
    email: "benjamin.taylor@example.com",
    name: "Benjamin Taylor",
    password: "123456",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    role: "nutritionist",
  },
  {
    email: "lucas.moore@example.com",
    name: "Lucas Moore",
    password: "123456",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    role: "nutritionist",
  },
  {
    email: "henry.jackson@example.com",
    name: "Henry Jackson",
    password: "123456",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    role: "nutritionist",
  },
  {
    email: "alexander.martin@example.com",
    name: "Alexander Martin",
    password: "123456",
    avatar: "https://randomuser.me/api/portraits/men/6.jpg",
    role: "nutritionist",
  },
  {
    email: "daniel.rodriguez@example.com",
    name: "Daniel Rodriguez",
    password: "123456",
    avatar: "https://randomuser.me/api/portraits/men/7.jpg",
    role: "nutritionist",
  },
];

export const seedDatabase = async () => {
  try {
    await connectDB();
    await User.insertMany(seedUsers);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};

// Call the function
// seedDatabase();
