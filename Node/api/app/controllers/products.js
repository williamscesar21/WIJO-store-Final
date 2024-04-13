const Product = require('../models/products');
const StatisticsSeller = require('../models/StatisticsSeller');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const obtenerProductos = async (req, res) => {
    try {
        const productos = await Product.find().limit();

        if (productos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos' });
        }

        res.status(200).json({ message: 'Productos encontrados', productos });
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error al obtener productos' });
    }
}

const verProductoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Product.findById(id);

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Producto encontrado', producto });
    } catch (error) {
        console.error('Error al obtener producto por ID:', error);
        res.status(500).json({ message: 'Error al obtener producto por ID' });
    }
}


// Función para generar un nombre único para el archivo
const generarNombreArchivo = () => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `${timestamp}-${random}`;
};

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Define el directorio donde se guardarán los archivos
        const uploadDir = path.join(__dirname, '../uploads/');
        
        // Verificar si el directorio existe, si no, crearlo
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Generar un nombre único para el archivo
        const nombreArchivo = generarNombreArchivo();
        cb(null, nombreArchivo + path.extname(file.originalname));
    }
});

// Middleware de Multer
const upload = multer({ 
    storage: storage,
    limits: {
        // Limita el tamaño del archivo a 5MB
        fileSize: 1024 * 1024 * 5 
    },
    fileFilter: function (req, file, cb) {
        // Solo acepta archivos de imagen
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen'));
        }
    }
}).single('images');

const crearProducto = async (req, res) => {
    try {
        // Ejecutar el middleware de Multer para cargar la imagen
        upload(req, res, async function(err) {
            if (err) {
                return res.status(400).json({ message: err.message });
            }

            // Verificar si se cargó una imagen
            if (!req.file) {
                return res.status(400).json({ message: 'Debe cargar una imagen' });
            }

            // Extraer los datos del formulario y la imagen cargada
            const { nombre, descripcion, marca, cantidad_disponible, envio, costo, id_vendedor, nombre_vendedor, estado_producto, id_categoria } = req.body;

            // Crear un nuevo producto con los datos proporcionados
            const producto = await Product.create({
                nombre,
                descripcion,
                marca,
                cantidad_disponible,
                envio,
                costo,
                id_vendedor,
                nombre_vendedor,
                estado_producto,
                id_categoria,
                images: [{ 
                    fileName: req.file.filename, 
                    contentType: req.file.mimetype 
                }] // Guardar el nombre de archivo y el tipo de contenido de la imagen
            });

            await StatisticsSeller.findOneAndUpdate(
                { id_vendedor: id_vendedor },
                { $push: { products: producto._id } }, // Agrega el ID del producto al arreglo de productos del vendedor
                { upsert: true } // Crea un nuevo documento de estadísticas si no existe para este vendedor
            );

            // Enviar respuesta al cliente
            res.status(201).json({
                message: 'Producto creado exitosamente',
                producto
            });
        });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ message: 'Error al crear producto', error: error.message });
    }
};



const actualizarProductoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, marca, cantidad_disponible, envio, costo, id_vendedor, nombre_vendedor, estado_producto, id_categoria } = req.body;

        const producto = await Product.findByIdAndUpdate(id, {
            nombre,
            descripcion,
            marca,
            cantidad_disponible,
            envio,
            costo,
            id_vendedor,
            nombre_vendedor,
            estado_producto,
            id_categoria
        }, { new: true });

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Producto actualizado exitosamente', producto });
    } catch (error) {
        console.error('Error al actualizar producto por ID:', error);
        res.status(500).json({ message: 'Error al actualizar producto por ID' });
    }
}

const eliminarProductoPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const producto = await Product.findByIdAndDelete(id);

        if (!producto) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
        console.error('Error al eliminar producto por ID:', error);
        res.status(500).json({ message: 'Error al eliminar producto por ID' });
    }
}

const buscarProductosPorPalabraClave = async (req, res) => {
    try {
        const { palabraClave } = req.params;
        // Utiliza una expresión regular para buscar productos que contengan la palabra clave en su nombre, sin importar mayúsculas o minúsculas
        const productos = await Product.find({ nombre: { $regex: new RegExp(palabraClave, 'i') } });
        //console.log('Buscado')

        if (productos.length === 0) {
            return res.status(404).json({ message: 'No se encontraron productos que coincidan con la palabra clave' });
        }

        res.status(200).json({ message: 'Productos encontrados', productos });
    } catch (error) {
        console.error('Error al buscar productos por palabra clave:', error);
        res.status(500).json({ message: 'Error al buscar productos por palabra clave' });
    }
}

module.exports = {
    buscarProductosPorPalabraClave,
    obtenerProductos,
    verProductoPorId,
    crearProducto,
    actualizarProductoPorId,
    eliminarProductoPorId
};
