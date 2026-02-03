import { db } from "./db";
import {
  users, villages, assessments, assessmentValues,
  type User, type InsertUser,
  type Village, type InsertVillage,
  type Assessment, type InsertAssessment,
  type AssessmentValue, type InsertAssessmentValue,
  type BulkUpdateValuesRequest
} from "@shared/schema";
import { eq, and, sql, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User>;

  // Village operations
  getVillages(search?: string): Promise<Village[]>;
  getVillage(id: number): Promise<Village | undefined>;
  createVillage(village: InsertVillage): Promise<Village>;
  updateVillage(id: number, village: Partial<InsertVillage>): Promise<Village>;
  deleteVillage(id: number): Promise<void>;

  // Assessment operations
  getAssessments(villageId?: number, year?: number): Promise<(Assessment & { village: Village })[]>;
  getAssessment(id: number): Promise<(Assessment & { village: Village; values: AssessmentValue[] }) | undefined>;
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  updateAssessment(id: number, updates: Partial<Assessment>): Promise<Assessment>;
  deleteAssessment(id: number): Promise<void>;
  
  // Assessment Values operations
  getAssessmentValues(assessmentId: number): Promise<AssessmentValue[]>;
  bulkUpdateAssessmentValues(assessmentId: number, values: { indicatorCode: string; value: number }[]): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // === User operations ===
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const [updated] = await db.update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  // === Village operations ===
  async getVillages(search?: string): Promise<Village[]> {
    if (search) {
      return await db.select().from(villages)
        .where(sql`lower(${villages.name}) LIKE lower(${`%${search}%`})`)
        .orderBy(desc(villages.createdAt));
    }
    return await db.select().from(villages).orderBy(desc(villages.createdAt));
  }

  async getVillage(id: number): Promise<Village | undefined> {
    const [village] = await db.select().from(villages).where(eq(villages.id, id));
    return village;
  }

  async createVillage(village: InsertVillage): Promise<Village> {
    const [newVillage] = await db.insert(villages).values(village).returning();
    return newVillage;
  }

  async updateVillage(id: number, updates: Partial<InsertVillage>): Promise<Village> {
    const [updated] = await db.update(villages)
      .set(updates)
      .where(eq(villages.id, id))
      .returning();
    return updated;
  }

  async deleteVillage(id: number): Promise<void> {
    await db.delete(villages).where(eq(villages.id, id));
  }

  async getAssessments(villageId?: number, year?: number): Promise<(Assessment & { village: Village })[]> {
    let conditions = [];
    if (villageId) conditions.push(eq(assessments.villageId, villageId));
    if (year) conditions.push(eq(assessments.year, year));

    const query = db.select({
      assessment: assessments,
      village: villages,
    })
    .from(assessments)
    .innerJoin(villages, eq(assessments.villageId, villages.id));

    if (conditions.length > 0) {
      query.where(and(...conditions));
    }

    const results = await query.orderBy(desc(assessments.year));
    return results.map(row => ({
      ...row.assessment,
      village: row.village
    }));
  }

  async getAssessment(id: number): Promise<(Assessment & { village: Village; values: AssessmentValue[] }) | undefined> {
    const [result] = await db.select({
      assessment: assessments,
      village: villages,
    })
    .from(assessments)
    .innerJoin(villages, eq(assessments.villageId, villages.id))
    .where(eq(assessments.id, id));

    if (!result) return undefined;

    const values = await db.select().from(assessmentValues).where(eq(assessmentValues.assessmentId, id));

    return {
      ...result.assessment,
      village: result.village,
      values,
    };
  }

  async createAssessment(assessment: InsertAssessment): Promise<Assessment> {
    const [newAssessment] = await db.insert(assessments).values(assessment).returning();
    return newAssessment;
  }

  async updateAssessment(id: number, updates: Partial<Assessment>): Promise<Assessment> {
    const [updated] = await db.update(assessments)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(assessments.id, id))
      .returning();
    return updated;
  }

  async deleteAssessment(id: number): Promise<void> {
    await db.delete(assessmentValues).where(eq(assessmentValues.assessmentId, id));
    await db.delete(assessments).where(eq(assessments.id, id));
  }

  async getAssessmentValues(assessmentId: number): Promise<AssessmentValue[]> {
    return await db.select().from(assessmentValues).where(eq(assessmentValues.assessmentId, assessmentId));
  }

  async bulkUpdateAssessmentValues(assessmentId: number, values: { indicatorCode: string; value: number }[]): Promise<void> {
    await db.transaction(async (tx) => {
      // Delete existing values for these codes (simple upsert strategy)
      // Or we can use ON CONFLICT if we had a unique constraint on assessmentId + indicatorCode
      // For simplicity, let's delete provided codes and insert new ones, or use upsert if schema allows.
      // Since we don't have unique constraint defined in schema.ts (yet), let's loop upsert manually or do a delete-insert for simplicity/safety
      
      for (const val of values) {
         // Check if exists
         const existing = await tx.select().from(assessmentValues).where(
            and(
                eq(assessmentValues.assessmentId, assessmentId),
                eq(assessmentValues.indicatorCode, val.indicatorCode)
            )
         );

         if (existing.length > 0) {
             await tx.update(assessmentValues)
                .set({ value: val.value })
                .where(eq(assessmentValues.id, existing[0].id));
         } else {
             await tx.insert(assessmentValues).values({
                 assessmentId,
                 indicatorCode: val.indicatorCode,
                 value: val.value
             });
         }
      }
    });
  }
}

export const storage = new DatabaseStorage();
