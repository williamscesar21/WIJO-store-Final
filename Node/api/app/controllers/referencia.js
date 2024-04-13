const Referencia = require('../models/referencia');

const subirReferencia = async (req, res) => {
    try {
        const { referencia } = req.body;
        // Verificar si la referencia ya existe
        const existente = await Referencia.findOne({ referencia });
        if (existente) {
            return res.status(400).json({ message: 'La referencia ya existe' });
        }
        // Crear la nueva referencia
        const nuevaReferencia = await Referencia.create({ referencia });
        res.status(201).json({ message: 'Referencia cargada exitosamente', referencia: nuevaReferencia });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verTodasReferencias = async (req, res) => {
    try {
        const referencias = await Referencia.find();
        res.status(200).json({ referencias });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    subirReferencia,
    verTodasReferencias
};
