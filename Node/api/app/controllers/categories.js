const categoriesModel = require('../models/categories');

const crearCategoria = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        const existente = await categoriesModel.findOne({ nombre });
        if (existente) {
            return res.status(400).json({ message: 'La categoria ya existe' });
        }
        const nuevaCategoria = await categoriesModel.create({
            nombre, 
            descripcion
         });
        res.status(201).json({ message: 'Categoría creada exitosamente', categoria: nuevaCategoria });
    }catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const verTodasCategorias = async (req, res) => {
    try {
        const categorias = await categoriesModel.find();
        res.status(200).json({ categorias });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const eliminarCategorias = async (req, res) => {
    try {
        const { categoryId } = req.params;

        // Buscar y eliminar la categoría por su ID
        const categoriaEliminada = await categoriesModel.findByIdAndDelete(categoryId);
        if (!categoriaEliminada) {
            return res.status(404).send({ message: 'No se encontró la categoría' });
        }

        res.status(200).send({ message: 'Categoría eliminada correctamente', categoria: categoriaEliminada });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}


module.exports = {
    crearCategoria,
    verTodasCategorias,
    eliminarCategorias
}