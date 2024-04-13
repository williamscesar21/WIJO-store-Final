const Checkout = require('../models/checkout');
const Product = require('../models/products');
const User = require('../models/users');
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

        // Retornar el ID de la transacción generada
        return transaction._id;

    } catch (error) {
        throw new Error('Error al registrar la transacción: ' + error.message);
    }
};


const obtenerIdVendedor = async (productId) => {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('El producto no existe');
        }
        return product.id_vendedor;
    } catch (error) {
        throw new Error('Error al obtener el ID del vendedor: ' + error.message);
    }
};

const comprarProducto = async (req, res) => {
    try {
        const { userId, productId, quantity, shippingMethod, operationId, shippingAddress, extraNote, shippingCompany } = req.body;

        // Obtener el ID del vendedor
        const sellerId = await obtenerIdVendedor(productId);

        // Verificar si el vendedor existe
        const vendedor = await User.findById(sellerId);
        if (!vendedor) {
            return res.status(404).json({ message: 'El vendedor no existe' });
        }

        // Verificar si el comprador existe
        const comprador = await User.findById(userId);
        if (!comprador) {
            return res.status(404).json({ message: 'El comprador no existe' });
        }

        // Verificar si hay suficiente cantidad disponible del producto
        const producto = await Product.findById(productId);
        if (!producto) {
            return res.status(404).json({ message: 'El producto no existe' });
        }
        if (quantity > producto.cantidad_disponible) {
            return res.status(400).json({ message: 'La cantidad solicitada excede la cantidad disponible' });
        }

        // Actualizar la cantidad disponible del producto
        producto.cantidad_disponible -= quantity;
        await producto.save();

        // Verificar si el comprador tiene suficiente saldo en la billetera
        const totalAmount = producto.precio * quantity;
        const compradorWallet = await Wallet.findOne({ owner: userId });
        if (!compradorWallet || compradorWallet.balance < totalAmount) {
            return res.status(400).json({ message: 'Saldo insuficiente en la billetera del comprador' });
        }

        // Verificar si la billetera del vendedor existe
        let vendedorWallet = await Wallet.findOne({ owner: sellerId });
        if (!vendedorWallet) {
            vendedorWallet = new Wallet({
                owner: sellerId
            });
        }

        // Transferir saldo al vendedor
        vendedorWallet.balance += totalAmount;
        await vendedorWallet.save();

        // Registrar la transacción en la billetera del vendedor y obtener el ID de la transacción generada
        const transactionGenerated = await registrarTransaccion(sellerId, totalAmount, 'sell');

        // Restar el saldo de la billetera del comprador
        compradorWallet.balance -= totalAmount;
        await compradorWallet.save();

        // Crear un nuevo documento de checkout
        const nuevoCheckout = new Checkout({
            userId,
            productId,
            quantity,
            shippingMethod,
            seller: sellerId,
            buyer: userId,
            operationId,
            transactionId: transactionGenerated, // Aquí se pasa el ID de la transacción generada
            shippingAddress,
            extraNote,
            shippingCompany,
            productName: producto.nombre,
            productPrice: producto.precio,
            sellerName: vendedor.nombre // Suponiendo que el nombre del vendedor está en el modelo de usuario
        });

        // Guardar el checkout en la base de datos
        await nuevoCheckout.save();

        // Realizar transacción de compra en la billetera del comprador
        await registrarTransaccion(userId, totalAmount, 'buy');

        res.status(200).json({ message: 'Compra realizada exitosamente', checkout: nuevoCheckout });
    } catch (error) {
        console.error('Error al realizar la compra:', error);
        res.status(500).json({ message: 'Error al realizar la compra', error: error.message });
    }
};




const verCheckoutsDeUsuario = async (req, res) => {
    try {
        const { userId } = req.params;

        // Buscar los checkouts del usuario
        const checkouts = await Checkout.find({ userId });

        if (!checkouts || checkouts.length === 0) {
            return res.status(404).json({ message: 'No se encontraron checkouts para este usuario' });
        }

        res.status(200).json({ message: 'Checkouts encontrados para este usuario', checkouts });
    } catch (error) {
        console.error('Error al obtener checkouts de usuario:', error);
        res.status(500).json({ message: 'Error al obtener checkouts de usuario', error: error.message });
    }
};
const verCheckoutsDeTodos = async (req, res) => {
    try {
        
        const checkouts = await Checkout.find();

        if (!checkouts || checkouts.length === 0) {
            return res.status(404).json({ message: 'No se encontraron checkouts' });
        }

        res.status(200).json({ message: 'Checkouts encontrados', checkouts });
    } catch (error) {
        console.error('Error al obtener checkouts', error);
        res.status(500).json({ message: 'Error al obtener checkouts', error: error.message });
    }
};


module.exports = {
    verCheckoutsDeUsuario,
    comprarProducto,
    verCheckoutsDeTodos
};
