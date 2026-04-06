import { prisma } from "../config/prisma.js";
import { AppError } from "../utils/appError.js";

const mapRecord = (record) => ({
  ...record,
  amount: Number(record.amount)
});

export const createRecord = async (payload) => {
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user) {
    throw new AppError("User not found for record", 404);
  }

  const record = await prisma.record.create({
    data: {
      userId: payload.userId,
      amount: payload.amount,
      type: payload.type,
      category: payload.category,
      date: payload.date,
      note: payload.note
    },
    include: {
      user: {
        select: { id: true, name: true, email: true }
      }
    }
  });

  return mapRecord(record);
};

export const getRecords = async (query) => {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const skip = (page - 1) * limit;

  const where = {};

  if (query.category) {
    where.category = query.category;
  }

  if (query.type) {
    where.type = query.type;
  }

  if (query.dateFrom || query.dateTo) {
    where.date = {};
    if (query.dateFrom) {
      where.date.gte = query.dateFrom;
    }
    if (query.dateTo) {
      where.date.lte = query.dateTo;
    }
  }

  const [records, total] = await Promise.all([
    prisma.record.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { date: "desc" },
      skip,
      take: limit
    }),
    prisma.record.count({ where })
  ]);

  return {
    records: records.map(mapRecord),
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};

export const updateRecord = async (id, payload) => {
  const existing = await prisma.record.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Record not found", 404);
  }

  if (payload.userId) {
    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) {
      throw new AppError("Target user not found", 404);
    }
  }

  const record = await prisma.record.update({
    where: { id },
    data: payload,
    include: {
      user: {
        select: { id: true, name: true, email: true }
      }
    }
  });

  return mapRecord(record);
};

export const deleteRecord = async (id) => {
  const existing = await prisma.record.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Record not found", 404);
  }

  await prisma.record.delete({ where: { id } });
};
