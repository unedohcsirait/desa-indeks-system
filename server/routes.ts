import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import ExcelJS from 'exceljs';

// Constants for Dimensions and Weights
const DIMENSIONS = [
  { id: '1', name: 'Layanan Dasar', weight: 26.77, prefix: '1' },
  { id: '2', name: 'Sosial', weight: 13.39, prefix: '2' },
  { id: '3', name: 'Ekonomi', weight: 25.20, prefix: '3' },
  { id: '4', name: 'Lingkungan', weight: 14.17, prefix: '4' },
  { id: '5', name: 'Aksesibilitas', weight: 7.87, prefix: '5' },
  { id: '6', name: 'Tata Kelola', weight: 12.60, prefix: '6' },
];

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // === VILLAGES ===
  app.get(api.villages.list.path, async (req, res) => {
    const search = req.query.search as string | undefined;
    const result = await storage.getVillages(search);
    res.json(result);
  });

  app.get(api.villages.get.path, async (req, res) => {
    const result = await storage.getVillage(Number(req.params.id));
    if (!result) return res.status(404).json({ message: "Village not found" });
    res.json(result);
  });

  app.post(api.villages.create.path, async (req, res) => {
    try {
      const input = api.villages.create.input.parse(req.body);
      const result = await storage.createVillage(input);
      res.status(201).json(result);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.message });
      }
      throw err;
    }
  });

  app.put(api.villages.update.path, async (req, res) => {
    try {
      const input = api.villages.update.input.parse(req.body);
      const result = await storage.updateVillage(Number(req.params.id), input);
      if (!result) return res.status(404).json({ message: "Village not found" });
      res.json(result);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.message });
      throw err;
    }
  });

  app.delete(api.villages.delete.path, async (req, res) => {
    await storage.deleteVillage(Number(req.params.id));
    res.status(204).send();
  });

  // === ASSESSMENTS ===
  app.get(api.assessments.list.path, async (req, res) => {
    const villageId = req.query.villageId ? Number(req.query.villageId) : undefined;
    const year = req.query.year ? Number(req.query.year) : undefined;
    const result = await storage.getAssessments(villageId, year);
    res.json(result);
  });

  app.get(api.assessments.get.path, async (req, res) => {
    const result = await storage.getAssessment(Number(req.params.id));
    if (!result) return res.status(404).json({ message: "Assessment not found" });
    res.json(result);
  });

  app.post(api.assessments.create.path, async (req, res) => {
    try {
      const input = api.assessments.create.input.parse(req.body);
      const result = await storage.createAssessment(input);
      res.status(201).json(result);
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.message });
      throw err;
    }
  });

  app.put(api.assessments.updateValues.path, async (req, res) => {
    try {
      const input = api.assessments.updateValues.input.parse(req.body);
      await storage.bulkUpdateAssessmentValues(Number(req.params.id), input.values);
      res.status(200).send();
    } catch (err) {
      if (err instanceof z.ZodError) return res.status(400).json({ message: err.message });
      throw err;
    }
  });

  app.post(api.assessments.calculate.path, async (req, res) => {
    const id = Number(req.params.id);
    const assessment = await storage.getAssessment(id);
    if (!assessment) return res.status(404).json({ message: "Assessment not found" });

    const values = assessment.values;
    const dimensionScores: Record<string, number> = {};
    let totalScore = 0;

    // Calculate score per dimension
    for (const dim of DIMENSIONS) {
      const dimValues = values.filter(v => v.indicatorCode.startsWith(dim.prefix));
      if (dimValues.length === 0) {
        dimensionScores[dim.name] = 0;
        continue;
      }
      
      const sum = dimValues.reduce((acc, curr) => acc + curr.value, 0);
      const avg = sum / dimValues.length; // Average score 1-5
      
      // Convert 1-5 scale to 0-100 scale??
      // Usually Index Desa is 0-100.
      // If indicators are 1-5: 
      // 1 = 20, 2 = 40, 3 = 60, 4 = 80, 5 = 100?
      // Or just raw avg?
      // "Indeks Desa akhir (100%)" suggests final is 0-100.
      // Let's assume (Value / 5) * 100 for normalization.
      const normalizedAvg = (avg / 5) * 100;

      dimensionScores[dim.name] = normalizedAvg;
      
      // Add weighted score to total
      totalScore += (normalizedAvg * dim.weight) / 100;
    }

    // Determine status
    let status = "";
    if (totalScore < 30) status = "Sangat Tertinggal";
    else if (totalScore < 50) status = "Tertinggal";
    else if (totalScore < 70) status = "Berkembang";
    else if (totalScore < 90) status = "Maju";
    else status = "Mandiri";

    const updated = await storage.updateAssessment(id, {
      totalScore: totalScore.toFixed(2) as any,
      dimensionScores,
      status
    });

    res.json(updated);
  });

  app.get(api.assessments.exportBulk.path, async (req, res) => {
    const year = req.query.year ? Number(req.query.year) : undefined;
    const assessments = await storage.getAssessments(undefined, year);
    
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(`Indeks Desa ${year || 'Semua Tahun'}`);

    // Headers based on the provided image
    sheet.columns = [
      { header: 'NO', key: 'no', width: 5 },
      { header: 'TAHUN', key: 'year', width: 8 },
      { header: 'KODE PROV', key: 'kode_prov', width: 12 },
      { header: 'NAMA PROVINSI', key: 'provinsi', width: 15 },
      { header: 'KODE KAB', key: 'kode_kab', width: 12 },
      { header: 'NAMA KABUPATEN', key: 'kabupaten', width: 20 },
      { header: 'KODE KEC', key: 'kode_kec', width: 12 },
      { header: 'NAMA KECAMATAN', key: 'kecamatan', width: 20 },
      { header: 'KODE DESA', key: 'kode_desa', width: 15 },
      { header: 'NAMA DESA', key: 'desa', width: 25 },
      { header: 'DLD', key: 'dld', width: 10 },
      { header: 'DS', key: 'ds', width: 10 },
      { header: 'DE', key: 'de', width: 10 },
      { header: 'DL', key: 'dl', width: 10 },
      { header: 'DA', key: 'da', width: 10 },
      { header: 'DTPD', key: 'dtpd', width: 10 },
      { header: 'BOBOT SKOR', key: 'skor', width: 12 },
      { header: 'STATUS DESA', key: 'status', width: 20 },
    ];

    // Styling headers
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    assessments.forEach((a, index) => {
      sheet.addRow({
        no: index + 1,
        year: a.year,
        kode_prov: a.village.provinceCode || '-',
        provinsi: a.village.province,
        kode_kab: a.village.regencyCode || '-',
        kabupaten: a.village.regency,
        kode_kec: a.village.districtCode || '-',
        kecamatan: a.village.district,
        kode_desa: a.village.code || '-',
        desa: a.village.name,
        dld: a.dimensionScores?.['Layanan Dasar'] ? `${Number(a.dimensionScores['Layanan Dasar']).toFixed(2)}%` : '-',
        ds: a.dimensionScores?.['Sosial'] ? `${Number(a.dimensionScores['Sosial']).toFixed(2)}%` : '-',
        de: a.dimensionScores?.['Ekonomi'] ? `${Number(a.dimensionScores['Ekonomi']).toFixed(2)}%` : '-',
        dl: a.dimensionScores?.['Lingkungan'] ? `${Number(a.dimensionScores['Lingkungan']).toFixed(2)}%` : '-',
        da: a.dimensionScores?.['Aksesibilitas'] ? `${Number(a.dimensionScores['Aksesibilitas']).toFixed(2)}%` : '-',
        dtpd: a.dimensionScores?.['Tata Kelola'] ? `${Number(a.dimensionScores['Tata Kelola']).toFixed(2)}%` : '-',
        skor: a.totalScore ? `${Number(a.totalScore).toFixed(2)}%` : '-',
        status: a.status || '-',
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Rekap-IndeksDesa-${year || 'Semua'}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  });

  app.get(api.assessments.export.path, async (req, res) => {
    const id = Number(req.params.id);
    const assessment = await storage.getAssessment(id);
    if (!assessment) return res.status(404).json({ message: "Assessment not found" });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Hasil Indeks Desa');

    sheet.columns = [
      { header: 'Item', key: 'item', width: 30 },
      { header: 'Value', key: 'value', width: 30 },
    ];

    sheet.addRow({ item: 'Desa', value: assessment.village.name });
    sheet.addRow({ item: 'Tahun', value: assessment.year });
    sheet.addRow({ item: 'Status', value: assessment.status });
    sheet.addRow({ item: 'Total Skor', value: assessment.totalScore });
    sheet.addRow({});
    sheet.addRow({ item: 'Dimensi', value: 'Skor' });
    
    if (assessment.dimensionScores) {
      Object.entries(assessment.dimensionScores).forEach(([key, val]) => {
        sheet.addRow({ item: key, value: Number(val).toFixed(2) });
      });
    }

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=IndeksDesa-${assessment.village.name}-${assessment.year}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
  });

  app.delete(api.assessments.delete.path, async (req, res) => {
    await storage.deleteAssessment(Number(req.params.id));
    res.status(204).send();
  });

  // Seed Data
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingVillages = await storage.getVillages();
  if (existingVillages.length === 0) {
    console.log("Seeding database...");
    const village = await storage.createVillage({
      name: "Desa Contoh",
      district: "Kecamatan Maju",
      regency: "Kabupaten Sejahtera",
      province: "Jawa Barat",
    });

    const assessment = await storage.createAssessment({
      villageId: village.id,
      year: 2024,
    });

    // Seed some initial values for dimension 1
    const initialValues = [
      { indicatorCode: '1.1.1', value: 3 },
      { indicatorCode: '1.1.2', value: 4 },
      { indicatorCode: '1.2.1', value: 5 },
    ];
    await storage.bulkUpdateAssessmentValues(assessment.id, initialValues);
    console.log("Database seeded!");
  }
}
