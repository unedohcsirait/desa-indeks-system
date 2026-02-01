import { pgTable, text, serial, integer, numeric, jsonb, timestamp, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const villages = pgTable("villages", {
  id: serial("id").primaryKey(),
  code: text("code"), // Kode Desa
  name: text("name").notNull(),
  district: text("district").notNull(), // Kecamatan
  districtCode: text("district_code"),  // Kode Kec
  regency: text("regency").notNull(),   // Kabupaten/Kota
  regencyCode: text("regency_code"),    // Kode Kab
  province: text("province").notNull(),
  provinceCode: text("province_code"),  // Kode Prov
  createdAt: timestamp("created_at").defaultNow(),
});

export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  villageId: integer("village_id").notNull(),
  year: integer("year").notNull(),
  status: text("status"), // Sangat Tertinggal, Tertinggal, Berkembang, Maju, Mandiri
  totalScore: numeric("total_score", { precision: 5, scale: 2 }), // 0-100
  dimensionScores: jsonb("dimension_scores").$type<Record<string, number>>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const assessmentValues = pgTable("assessment_values", {
  id: serial("id").primaryKey(),
  assessmentId: integer("assessment_id").notNull(),
  indicatorCode: text("indicator_code").notNull(), // e.g., '1.1.1'
  value: integer("value").notNull(), // 1-5
});

// === RELATIONS ===

export const villagesRelations = relations(villages, ({ many }) => ({
  assessments: many(assessments),
}));

export const assessmentsRelations = relations(assessments, ({ one, many }) => ({
  village: one(villages, {
    fields: [assessments.villageId],
    references: [villages.id],
  }),
  values: many(assessmentValues),
}));

export const assessmentValuesRelations = relations(assessmentValues, ({ one }) => ({
  assessment: one(assessments, {
    fields: [assessmentValues.assessmentId],
    references: [assessments.id],
  }),
}));

// === BASE SCHEMAS ===

export const insertVillageSchema = createInsertSchema(villages).omit({ id: true, createdAt: true });
export const insertAssessmentSchema = createInsertSchema(assessments).omit({ id: true, createdAt: true, updatedAt: true, status: true, totalScore: true, dimensionScores: true });
export const insertAssessmentValueSchema = createInsertSchema(assessmentValues).omit({ id: true });

// === EXPLICIT API CONTRACT TYPES ===

export type Village = typeof villages.$inferSelect;
export type InsertVillage = z.infer<typeof insertVillageSchema>;
export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type AssessmentValue = typeof assessmentValues.$inferSelect;
export type InsertAssessmentValue = z.infer<typeof insertAssessmentValueSchema>;

// Request types
export type CreateVillageRequest = InsertVillage;
export type UpdateVillageRequest = Partial<InsertVillage>;
export type CreateAssessmentRequest = InsertAssessment;
export type UpdateAssessmentValueRequest = {
  value: number;
};
export type BulkUpdateValuesRequest = {
  assessmentId: number;
  values: { indicatorCode: string; value: number }[];
};

// Response types
export type VillageResponse = Village;
export type AssessmentResponse = Assessment & { village?: Village }; // Joined
export type AssessmentDetailResponse = Assessment & {
  village: Village;
  values: AssessmentValue[];
};
