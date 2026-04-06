import { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma.js";

const buildDateWhere = (query) => {
  if (!query.dateFrom && !query.dateTo) {
    return {};
  }

  const date = {};
  if (query.dateFrom) {
    date.gte = query.dateFrom;
  }
  if (query.dateTo) {
    date.lte = query.dateTo;
  }

  return { date };
};

const toNumber = (value) => Number(value || 0);

export const getSummary = async (query) => {
  const where = buildDateWhere(query);

  const [totalsByType, categoryTotalsRaw, lastTransactions, monthlyRaw] = await Promise.all([
    prisma.record.groupBy({
      by: ["type"],
      _sum: { amount: true },
      where
    }),
    prisma.record.groupBy({
      by: ["category"],
      _sum: { amount: true },
      where,
      orderBy: { category: "asc" }
    }),
    prisma.record.findMany({
      where,
      orderBy: { date: "desc" },
      take: 5,
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    }),
    prisma.$queryRaw`
      SELECT
        to_char(date_trunc('month', "date"), 'YYYY-MM') AS month,
        COALESCE(SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END), 0) AS income,
        COALESCE(SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END), 0) AS expense
      FROM "Record"
      WHERE ${query.dateFrom ? Prisma.sql`"date" >= ${query.dateFrom}` : Prisma.sql`TRUE`}
        AND ${query.dateTo ? Prisma.sql`"date" <= ${query.dateTo}` : Prisma.sql`TRUE`}
      GROUP BY date_trunc('month', "date")
      ORDER BY date_trunc('month', "date") DESC
    `
  ]);

  const totals = totalsByType.reduce(
    (acc, item) => {
      if (item.type === "INCOME") {
        acc.totalIncome = toNumber(item._sum.amount);
      }
      if (item.type === "EXPENSE") {
        acc.totalExpense = toNumber(item._sum.amount);
      }
      return acc;
    },
    { totalIncome: 0, totalExpense: 0 }
  );

  const netBalance = totals.totalIncome - totals.totalExpense;

  const categoryTotals = categoryTotalsRaw.map((row) => ({
    category: row.category,
    total: toNumber(row._sum.amount)
  }));

  const mappedLastTransactions = lastTransactions.map((tx) => ({
    ...tx,
    amount: toNumber(tx.amount)
  }));

  const monthlyAggregation = monthlyRaw.map((row) => ({
    month: row.month,
    income: toNumber(row.income),
    expense: toNumber(row.expense),
    net: toNumber(row.income) - toNumber(row.expense)
  }));

  return {
    totalIncome: totals.totalIncome,
    totalExpense: totals.totalExpense,
    netBalance,
    categoryTotals,
    lastTransactions: mappedLastTransactions,
    monthlyAggregation
  };
};
