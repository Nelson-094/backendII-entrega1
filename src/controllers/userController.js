import UserRepository from '../repositories/UserRepository.js';
import UserDTO from '../dto/UserDTO.js';

const userRepository = new UserRepository();

/**
 * Obtener todos los usuarios (solo admin)
 * GET /api/users
 */
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await userRepository.getAll();
        const usersDTO = users.map(user => new UserDTO(user));

        res.status(200).json({
            status: 'success',
            results: usersDTO.length,
            data: {
                users: usersDTO
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Obtener usuario por ID
 * GET /api/users/:id
 */
export const getUserById = async (req, res, next) => {
    try {
        const user = await userRepository.getById(req.params.id);
        const userDTO = new UserDTO(user);

        res.status(200).json({
            status: 'success',
            data: {
                user: userDTO
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Actualizar usuario
 * PUT /api/users/:id
 */
export const updateUser = async (req, res, next) => {
    try {
        const { first_name, last_name, email, age } = req.body;

        const updateData = {};
        if (first_name) updateData.first_name = first_name;
        if (last_name) updateData.last_name = last_name;
        if (email) updateData.email = email;
        if (age) updateData.age = age;

        const user = await userRepository.update(req.params.id, updateData);
        const userDTO = new UserDTO(user);

        res.status(200).json({
            status: 'success',
            message: 'Usuario actualizado exitosamente',
            data: {
                user: userDTO
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Eliminar usuario (solo admin)
 * DELETE /api/users/:id
 */
export const deleteUser = async (req, res, next) => {
    try {
        await userRepository.delete(req.params.id);

        res.status(200).json({
            status: 'success',
            message: 'Usuario eliminado exitosamente'
        });
    } catch (error) {
        next(error);
    }
};
