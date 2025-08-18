import Role from '../models/roleModel.mjs';

//READ
export async function findRoleByName(roleName) {
    return await Role.findOne({ name: roleName }).lean();
}

export async function findRoleById(roleId) {
    return await Role.findById(roleId).populate('permissions', 'name').lean();
}