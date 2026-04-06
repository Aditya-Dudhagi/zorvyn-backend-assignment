import { z } from "zod";

export const roleEnum = z.enum(["VIEWER", "ANALYST", "ADMIN"]);
const userStatusEnum = z.enum(["ACTIVE", "INACTIVE"]);
const recordTypeEnum = z.enum(["INCOME", "EXPENSE"]);

export const registerSchema = {
  body: z.object({
    name: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(8).max(72)
  })
};

export const loginSchema = {
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8).max(72)
  })
};

export const updateUserStatusSchema = {
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    status: userStatusEnum
  })
};

export const createRecordSchema = {
  body: z.object({
    userId: z.string().uuid(),
    amount: z.coerce.number().positive(),
    type: recordTypeEnum,
    category: z.string().min(1).max(100),
    date: z.coerce.date(),
    note: z.string().max(500).optional()
  })
};

export const updateRecordSchema = {
  params: z.object({
    id: z.string().uuid()
  }),
  body: z
    .object({
      userId: z.string().uuid().optional(),
      amount: z.coerce.number().positive().optional(),
      type: recordTypeEnum.optional(),
      category: z.string().min(1).max(100).optional(),
      date: z.coerce.date().optional(),
      note: z.string().max(500).nullable().optional()
    })
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field is required"
    })
};

export const deleteRecordSchema = {
  params: z.object({
    id: z.string().uuid()
  })
};

export const listRecordsQuerySchema = {
  query: z
    .object({
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().max(100).default(10),
      dateFrom: z.coerce.date().optional(),
      dateTo: z.coerce.date().optional(),
      category: z.string().min(1).max(100).optional(),
      type: recordTypeEnum.optional()
    })
    .refine((data) => !data.dateFrom || !data.dateTo || data.dateFrom <= data.dateTo, {
      message: "dateFrom must be less than or equal to dateTo"
    })
};

export const summaryQuerySchema = {
  query: z
    .object({
      dateFrom: z.coerce.date().optional(),
      dateTo: z.coerce.date().optional()
    })
    .refine((data) => !data.dateFrom || !data.dateTo || data.dateFrom <= data.dateTo, {
      message: "dateFrom must be less than or equal to dateTo"
    })
};

