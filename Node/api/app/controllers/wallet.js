const Wallet = require('../models/wallet');

const registrarTransaccion = async (userId, amount, type) => {
    try {
        const wallet = await Wallet.findOne({ owner: userId });
        if (!wallet) {
            throw new Error('No existe la billetera');
        }

        // Crear una nueva transacción
        const transaction = {
            amount: amount,
            type: type
        };

        // Agregar la transacción al historial de transacciones de la billetera
        wallet.transactions.push(transaction);

        // Guardar la billetera con la nueva transacción
        await wallet.save();
    } catch (error) {
        throw new Error('Error al registrar la transacción: ' + error.message);
    }
};

const obtenerSaldo = async (req, res) => {
    try {
        const { userId } = req.params;
        const wallet = await Wallet.findOne({ owner: userId });
        if (!wallet) {
            res.status(404).send({ message: 'No existe la billetera' });
            return;
        }
        res.status(200).send({ walletId: wallet._id, balance: wallet.balance }); // Agregar el ID de la billetera
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const obtenerTodasBilleteras = async (req, res) => {
    try {
        // Buscar todas las billeteras
        const wallets = await Wallet.find();

        if (!wallets || wallets.length === 0) {
            return res.status(404).send({ message: 'No hay billeteras' });
        }

        // Crear un array para almacenar los datos de las billeteras
        const walletsData = [];

        // Iterar sobre cada billetera y obtener los datos necesarios
        for (const wallet of wallets) {
            walletsData.push({
                owner: wallet.owner,
                balance: wallet.balance
            });
        }

        // Devolver los datos de todas las billeteras
        res.status(200).send({ wallets: walletsData });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const recargarSaldo = async (req, res) => {
    try {
        const { userId } = req.params;
        const { amount } = req.body;

        // Verificar si la billetera del usuario existe
        let wallet = await Wallet.findOne({ owner: userId });
        if (!wallet) {
            wallet = new Wallet({
                owner: userId
            });
        }

        // Realizar la recarga de saldo
        wallet.balance += amount;
        await wallet.save();

        // Registrar la transacción de recarga
        await registrarTransaccion(userId, amount, 'deposit');

        res.status(200).send({ message: 'Recarga exitosa', balance: wallet.balance });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const transferirSaldo = async (req, res) => {
    try {
        const { origen, destino, monto } = req.body;

        // Verificar si las billeteras de origen y destino existen
        const walletOrigen = await Wallet.findOne({ owner: origen });
        const walletDestino = await Wallet.findOne({ owner: destino });

        if (!walletOrigen) {
            return res.status(404).send({ message: 'La billetera de origen no existe' });
        }
        
        if (!walletDestino) {
            return res.status(404).send({ message: 'La billetera de destino no existe' });
        }

        // Verificar si hay suficiente saldo en la billetera de origen
        if (walletOrigen.balance < monto) {
            return res.status(400).send({ message: 'Saldo insuficiente en la billetera de origen' });
        }

        // Transferir saldo
        walletOrigen.balance -= monto;
        walletDestino.balance += monto;

        await walletOrigen.save();
        await walletDestino.save();

        // Registrar la transacción de transferencia para la billetera de origen
        await registrarTransaccion(origen, monto, 'transfer');

        // Registrar la transacción de transferencia para la billetera de destino
        await registrarTransaccion(destino, monto, 'deposit');

        res.status(200).send({ message: 'Transferencia exitosa' });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

const verTransacciones = async (req, res) => {
    try {
        const { userId } = req.params;

        // Buscar la billetera del usuario
        const wallet = await Wallet.findOne({ owner: userId });

        if (!wallet) {
            return res.status(404).json({ message: 'No existe la billetera' });
        }

        // Devolver el historial de transacciones de la billetera
        res.status(200).json({ transactions: wallet.transactions });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener transacciones', error: error.message });
    }
};


module.exports = {
    registrarTransaccion,
    obtenerTodasBilleteras,
    verTransacciones,
    obtenerSaldo,
    recargarSaldo,
    transferirSaldo
};
