import 'dotenv/config';
import { db } from "../server/db";
import { users } from "../shared/schema";
import { hashPassword } from "../server/auth";

async function seedUsers() {
  try {
    // Check if users already exist
    const existingUsers = await db.select().from(users);
    
    if (existingUsers.length > 0) {
      console.log("Users already exist in database. Skipping seed.");
      return;
    }

    // Hash password for test user
    const hashedPassword = await hashPassword("password123");

    // Create test users
    const testUsers = [
      {
        username: "admin",
        email: "admin@example.com",
        passwordHash: hashedPassword,
      },
      {
        username: "user",
        email: "user@example.com",
        passwordHash: hashedPassword,
      },
    ];

    await db.insert(users).values(testUsers);
    console.log("✓ Users seeded successfully");
    console.log("Test user credentials:");
    console.log("- Username: admin, Password: password123");
    console.log("- Username: user, Password: password123");
  } catch (error) {
    console.error("Error seeding users:", error);
    process.exit(1);
  }
}

seedUsers();
