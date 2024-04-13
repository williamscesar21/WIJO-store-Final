const CartItem = require('../models/cart');
const Product = require('../models/products'); 

const agregarProductoAlCarrito = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Verificar si el producto existe
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        
        const price = product.precio; 

        
        let cart = await CartItem.findOne({ user: userId });

        if (cart) {
            // Si el usuario ya tiene un carrito, verificar si el producto ya está en el carrito
            const existingItemIndex = cart.items.findIndex(item => item.product.equals(productId));

            if (existingItemIndex !== -1) {
                // Si el producto ya está en el carrito, simplemente actualizar la cantidad
                cart.items[existingItemIndex].quantity += quantity;
            } else {
                // Si el producto no está en el carrito, agregar un nuevo elemento al carrito
                cart.items.push({ product: productId, quantity: quantity, price: price });
            }

            // Actualizar el total del carrito
            cart.total += price * quantity;
        } else {
            // Si el usuario no tiene un carrito, crear uno nuevo
            cart = new CartItem({
                user: userId,
                items: [{ product: productId, quantity: quantity, price: price }],
                total: price * quantity
            });
        }

        // Guardar el carrito actualizado en la base de datos
        await cart.save();

        res.status(200).json({ message: 'Producto agregado al carrito exitosamente' });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ message: 'Error al agregar producto al carrito', error: error.message });
    }
}


const verCarritoDeUsuario = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Buscar el carrito del usuario
        let cart = await CartItem.findOne({ user: userId }).populate('items.product');

        // Si no se encuentra un carrito para el usuario, crear uno nuevo
        if (!cart) {
            cart = new CartItem({
                user: userId,
                items: [],
                total: 0
            });
            await cart.save();
            return res.status(200).json({ message: 'Carrito creado para el usuario', itemsCarrito: [], total: 0 });
        }

        res.status(200).json({ message: 'Elementos encontrados en el carrito', itemsCarrito: cart.items, total: cart.total });
    } catch (error) {
        console.error('Error al ver el carrito de usuario:', error);
        res.status(500).json({ message: 'Error al ver el carrito de usuario', error: error.message });
    }
}


const borrarProductoDelCarrito = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        // Buscar el carrito del usuario
        let cart = await CartItem.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        // Encontrar el índice del producto en el carrito
        const productIndex = cart.items.findIndex(item => item.product.equals(productId));

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }

        // Obtener el precio del producto a eliminar
        const price = cart.items[productIndex].price;
        // Obtener la cantidad del producto a eliminar
        const quantity = cart.items[productIndex].quantity;

        // Restar el precio del producto eliminado del total del carrito
        cart.total -= price * quantity;

        // Eliminar el producto del carrito
        cart.items.splice(productIndex, 1);

        // Guardar el carrito actualizado en la base de datos
        await cart.save();

        res.status(200).json({ message: 'Producto eliminado del carrito exitosamente' });
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).json({ message: 'Error al eliminar producto del carrito', error: error.message });
    }
}

const actualizarCantidadProductoEnCarrito = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const { quantity } = req.body;

        // Buscar el carrito del usuario
        let cart = await CartItem.findOne({ user: userId });

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        // Encontrar el índice del producto en el carrito
        const productIndex = cart.items.findIndex(item => item.product.equals(productId));

        if (productIndex === -1) {
            return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
        }

        // Obtener el precio del producto antes de actualizar la cantidad
        const price = cart.items[productIndex].price;

        // Actualizar la cantidad del producto en el carrito
        cart.items[productIndex].quantity = quantity;

        // Calcular el nuevo total del carrito
        const updatedTotal = cart.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

        // Actualizar el total del carrito
        cart.total = updatedTotal;

        // Guardar el carrito actualizado en la base de datos
        await cart.save();

        res.status(200).json({ message: 'Cantidad del producto en el carrito actualizada exitosamente', updatedTotal });
    } catch (error) {
        console.error('Error al actualizar la cantidad del producto en el carrito:', error);
        res.status(500).json({ message: 'Error al actualizar la cantidad del producto en el carrito', error: error.message });
    }
}




module.exports = {
    actualizarCantidadProductoEnCarrito,
    borrarProductoDelCarrito,
    verCarritoDeUsuario,
    agregarProductoAlCarrito
};
