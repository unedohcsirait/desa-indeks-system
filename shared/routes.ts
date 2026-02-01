import { z } from 'zod';
import { insertVillageSchema, insertAssessmentSchema, villages, assessments } from './schema';

// ============================================
// SHARED ERROR SCHEMAS
// ============================================
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// ============================================
// API CONTRACT
// ============================================
export const api = {
  villages: {
    list: {
      method: 'GET' as const,
      path: '/api/villages',
      input: z.object({
        search: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof villages.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/villages/:id',
      responses: {
        200: z.custom<typeof villages.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/villages',
      input: insertVillageSchema,
      responses: {
        201: z.custom<typeof villages.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/villages/:id',
      input: insertVillageSchema.partial(),
      responses: {
        200: z.custom<typeof villages.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/villages/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  assessments: {
    list: {
      method: 'GET' as const,
      path: '/api/assessments',
      input: z.object({
        villageId: z.coerce.number().optional(),
        year: z.coerce.number().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof assessments.$inferSelect & { village: typeof villages.$inferSelect }>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/assessments/:id',
      responses: {
        200: z.custom<typeof assessments.$inferSelect & { village: typeof villages.$inferSelect; values: any[] }>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/assessments',
      input: insertAssessmentSchema,
      responses: {
        201: z.custom<typeof assessments.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    calculate: {
      method: 'POST' as const,
      path: '/api/assessments/:id/calculate',
      responses: {
        200: z.custom<typeof assessments.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    updateValues: {
      method: 'PUT' as const,
      path: '/api/assessments/:id/values',
      input: z.object({
        values: z.array(z.object({
          indicatorCode: z.string(),
          value: z.number().min(1).max(5),
        })),
      }),
      responses: {
        200: z.void(),
        404: errorSchemas.notFound,
      },
    },
    export: {
      method: 'GET' as const,
      path: '/api/assessments/:id/export',
      responses: {
        200: z.any(), // Binary file
      },
    },
    exportBulk: {
      method: 'GET' as const,
      path: '/api/assessments/export/bulk',
      input: z.object({
        year: z.coerce.number().optional(),
      }).optional(),
      responses: {
        200: z.any(),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/assessments/:id',
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
