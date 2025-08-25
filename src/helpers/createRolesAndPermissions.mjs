import 'dotenv/config';
import Permission from '../models/permissionModel.mjs';
import Role from '../models/roleModel.mjs';

const initialPermissions = [
    // COUNTRIES
    { name: 'create:countries', description: 'Can create countries' },
    { name: 'read:countries', description: 'Can read countries' },
    { name: 'update:countries', description: 'Can update countries' },
    { name: 'delete:countries', description: 'Can delete countries' },
    // USERS
    { name: 'create:users', description: 'Can create users' },
    { name: 'read:users', description: 'Can read users' },
    { name: 'update:users', description: 'Can update users' },
    { name: 'delete:users', description: 'Can delete users' },
    // RADIO
    { name: 'create:radio', description: 'Can create radio marker' },
    { name: 'read:radio', description: 'Can read radio marker' },
    { name: 'update:radio', description: 'Can update radio marker' },
    { name: 'delete:radio', description: 'Can delete radio marker' },
];

const initialRoles = [
    {
        name: 'user',
        description: 'Basic user account',
        permissions: [
            'read:countries',
            'create:markers', 'read:markers', 'update:markers', 'delete:markers',
            'read:users', 'update:users', 'delete:users',
            'create:radios', 'read:radios', 'update:radios', 'delete:radios',
        ]
    },
    {
        name: 'admin',
        description: 'Administrator user account',
        permissions: [
            'create:countries', 'read:countries', 'update:countries', 'delete:countries',
            'create:markers', 'read:markers', 'update:markers', 'delete:markers',
            'create:users', 'read:users', 'update:users', 'delete:users',
            'create:radios', 'read:radios', 'update:radios', 'delete:radios',
        ]
    },
];

export async function initializeRolesAndPermissions() {
    try {
        // Creates / updates permissions
        for (const perm of initialPermissions) {
            await Permission.updateOne(
                { name: perm.name },
                { $set: { description: perm.description } },
                { upsert: true }
            );
        }
        console.log('Permissions initialized or updated');

        // maps current Permissions
        const allPermissions = await Permission.find();
        const permissionsMap = allPermissions.reduce((map, p) => {
            map[p.name] = p._id;
            return map;
        }, {});

        // Creates / updates roles
        for (const role of initialRoles) {
            const permIds = role.permissions.map(pName => permissionsMap[pName]);
            await Role.updateOne(
                { name: role.name },
                {
                    $set: {
                        description: role.description,
                        permissions: permIds
                    }
                },
                { upsert: true }
            );
        }
        console.log('Roles initialized or updated');

        return true;
    } catch (error) {
        console.log('Error initializing roles and permissions:', error);
        return false;
    }
}
