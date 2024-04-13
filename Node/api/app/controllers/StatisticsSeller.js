const StatisticsSeller = require('../models/StatisticsSeller');
const Wallet = require('../models/wallet');

const VerStatisticsSellers = async (req, res) => {
    const userId = req.params.userId;

    try {
        // Obtener las transacciones de tipo 'sell' del usuario
        const wallet = await Wallet.findOne({ owner: userId });
        if (!wallet) {
            return res.status(404).json({ message: 'No existe la billetera para este usuario' });
        }

        const sellTransactions = wallet.transactions.filter(transaction => transaction.type === 'sell');

        // Calcular la suma de las ventas totales
        const ventas_totales = sellTransactions.reduce((total, transaction) => total + transaction.amount, 0);

        // Contar la cantidad de productos vendidos
        const cantidad_productos_vendidos = sellTransactions.length;

        // Crear o actualizar las estadísticas del vendedor
        let statisticsSellers = await StatisticsSeller.findOne({ id_vendedor: userId });
        if (!statisticsSellers) {
            statisticsSellers = new StatisticsSeller({
                id_vendedor: userId,
                ventas_totales,
                cantidad_productos_vendidos
            });
        } else {
            statisticsSellers.ventas_totales = ventas_totales;
            statisticsSellers.cantidad_productos_vendidos = cantidad_productos_vendidos;
        }

        await statisticsSellers.save();

        res.status(200).json({ statisticsSellers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { VerStatisticsSellers };
