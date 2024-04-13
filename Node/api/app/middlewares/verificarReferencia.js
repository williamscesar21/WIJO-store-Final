const Referencia = require('../models/referencia');

const verificarReferencia = async (req, res, next) => {
    try {
        const { referencia } = req.body;

        // Verificar si la referencia existe y no ha sido usada
        const referenciaExistente = await Referencia.findOne({ referencia, usado: false });
        if (!referenciaExistente) {
            return res.status(400).send({ message: 'La referencia no es valida o ya ha sido utilizada' });
        }

        // Si la referencia es valida, pasamos al siguiente middleware
        req.referenciaValida = referenciaExistente;
        next();
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

module.exports = verificarReferencia;