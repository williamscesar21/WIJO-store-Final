//users.js controlador de la ruta /users

const UsersModel = require('../models/users');
const Wallet = require('../models/wallet');
const obtenerusuarios = async (req, res)=>{
    try {
        const usuarios = await UsersModel.find();

        if (usuarios.length === 0) {
            return res.status(404).json({ message: 'No se encontraron usuarios' });
        }

        res.status(200).json({ message: 'Usuarios encontrados', usuarios });
    } catch (error) {
        
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error al obtener usuarios' });
    }
}

const crearUsuario = async (req, res)=>{
   try {
        const {nombre, apellido, cedula, direccion, correo, telefono, roles, metodo_entrega, clave, suspendido, eliminar} = req.body;    
        const user =await UsersModel.create({
            nombre, 
            apellido,
            cedula,
            direccion,
            correo,
            telefono,
            roles,
            metodo_entrega, 
            clave: await UsersModel.encryptPassword(clave),
            suspendido,
            eliminar
       });

       const wallet = await Wallet.create({
        owner: user._id, // Aquí se usa el ID del usuario recién creado como propietario de la billetera
        balance: 0 // Puedes establecer un saldo inicial si lo deseas
   });

        res.status(200).json({messgae: 'Usuario creado exitosamente', user});

   }catch (e) {
        res.status(500).json({message: e.message});
        
    }
}

const actualizarClave = async (req, res) =>{
    try{
        const { userId, clave } = req.body;

        // Encontrar al usuario por su ID y actualizar su clave encriptada
        const usuario = await UsersModel.findByIdAndUpdate(userId, { clave: await UsersModel.encryptPassword(clave) }, { new: true });

        // Verificar si el usuario existe
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Clave actualizada exitosamente', usuario });
    } catch(e){
        res.status(500).json({ message: e.message });
    }
}


const suspenderUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await UsersModel.findByIdAndUpdate(id, { suspendido: true }, { new: true });

        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario suspendido exitosamente', usuario });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const actualizarUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const usuarioExistente = await UsersModel.findById(id);

        if (!usuarioExistente) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar si los valores enviados ya están presentes en la base de datos
        const valoresExistentes = Object.keys(updates).filter(key => usuarioExistente[key] === updates[key]);
        if (valoresExistentes.length > 0) {
            return res.status(400).json({ message: `Los siguientes valores ya están presentes en la base de datos: ${valoresExistentes.join(', ')}` });
        }

        const usuarioActualizado = await UsersModel.findByIdAndUpdate(id, updates, { new: true });

        res.status(200).json({ message: 'Usuario actualizado exitosamente', usuarioActualizado });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



const eliminarUsuarioPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioEliminado = await UsersModel.findByIdAndUpdate(id, { eliminar: true }, { new: true });

        if (!usuarioEliminado) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario marcado como eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



module.exports = { actualizarClave, obtenerusuarios, crearUsuario, suspenderUsuarioPorId, actualizarUsuarioPorId, eliminarUsuarioPorId };
