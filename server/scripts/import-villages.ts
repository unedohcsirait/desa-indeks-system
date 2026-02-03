import 'dotenv/config';
import { db } from "../db";
import { villages } from "../../shared/schema";

async function importVillages() {
  try {
    const data = [
      { name: "Desa Kebon", district: "Kecamatan Utara", regency: "Kabupaten Indah", province: "Jawa Barat", code: "32.01.01.2001" },
      { name: "Desa Sawah", district: "Kecamatan Selatan", regency: "Kabupaten Indah", province: "Jawa Barat", code: "32.01.01.2002" },
      { name: "Desa Hutan", district: "Kecamatan Timur", regency: "Kabupaten Indah", province: "Jawa Barat", code: "32.01.01.2003" },
      { name: "Desa Gunung", district: "Kecamatan Barat", regency: "Kabupaten Indah", province: "Jawa Barat", code: "32.01.01.2004" }
    ];

    console.log("Importing villages...");
    for (const item of data) {
      await db.insert(villages).values(item);
      console.log(`✓ Imported ${item.name}`);
    }
    console.log("Village import completed!");
    process.exit(0);
  } catch (error) {
    console.error("Error importing villages:", error);
    process.exit(1);
  }
}

importVillages();
