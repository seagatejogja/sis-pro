'use server'

import { prisma } from '@/lib/prisma'

export async function getFinancialReports() {
  try {
    const invoices = await prisma.invoice.findMany({
      where: { status: 'PAID' },
      orderBy: { date: 'asc' }
    });

    let totalRevenue = 0;
    let totalHpp = 0;
    
    // Aggregation
    const chartData = invoices.map(inv => {
      totalRevenue += inv.total_amount;
      totalHpp += inv.total_hpp;
      return {
        date: new Date(inv.date).toLocaleDateString(),
        revenue: inv.total_amount,
        profit: inv.total_amount - inv.total_hpp
      };
    });

    const grossProfit = totalRevenue - totalHpp;
    const investorShare = grossProfit * 0.20; // 20% Bagi Hasil Investor PRD
    const itiShare = grossProfit * 0.80; // 80% Laba Bersih PT ITI

    return { 
      success: true, 
      data: {
        totalRevenue,
        totalHpp,
        grossProfit,
        investorShare,
        itiShare,
        transactions: invoices.length,
        chartData
      } 
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
