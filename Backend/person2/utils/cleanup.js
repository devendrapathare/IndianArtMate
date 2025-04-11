import WalletTransaction from '../models/walletTransactionModel.js';

export const cleanPendingTransactions = async () => {
    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);

    try {
        const result = await WalletTransaction.deleteMany({
            paymentStatus: 'pending',
            createdAt: { $lt: fifteenMinsAgo }
        });

        console.log(`🧹 Cleaned ${result.deletedCount} pending transactions`);
    } catch (error) {
        console.error("❌ Error cleaning pending transactions:", error.message);
    }
};
