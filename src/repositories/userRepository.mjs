import User from "../models/userModel.mjs";
import IRepository from './IRepository.mjs';
import bcrypt from "bcryptjs";

class UserRepository extends IRepository {

    //READ
    async readAll() {
        return await User.find()
            .populate('role', 'name description') // Brings description of role
            .sort({ 'username': 1 })
            .lean(); //(JSON)
    }

    async readByLocation(code) {
        return await User.find({ location: code },
            { _id: 1, username: 1, email: 1 })
    }

    async readById(id) {
        return await User.findById(id).populate('role', 'name description').lean();
    }

    async readByEmail(email) {
        return await User.findOne({ email }).populate('role', 'name description').lean();
    }

    async readByUsername(username) {
        return await User.findOne({ username }).populate('role', 'name description').lean();
    }

    async readDuplicates(field = 'email') {
        const duplicates = await User.aggregate([
            {
                $group: {
                    _id: `$${field}`,          // Group by parameter field
                    count: { $sum: 1 },
                    docs: { $push: "$$ROOT" }
                }
            },
            {
                $match: { count: { $gt: 1 } } // Duplicates
            },
            {
                $project: { _id: 0, docs: 1 } // Just Docs
            }
        ]);
        //Flatten Array
        return duplicates.flatMap(group => group.docs);
    }

    //CREATE
    async createNew(userData) {
        // Hash de contraseña
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const newUser = new User({
            username: userData.username,
            email: userData.email,
            password: hashedPassword,
            location: userData.location,
            role: userData.role // Must be Object ID
        });

        const savedUser = await newUser.save()
        return savedUser.toObject();
    }

    //UPDATE
    async updateById(id, updateData) {
        // Hash password if it comes
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10);
        }

        // Avoid duplicates in username or email
        const checks = [];
        if (updateData.username) {
            checks.push(
                User.findOne({ username: updateData.username, _id: { $ne: id } })
                    .then(existing => { if (existing) throw new Error('Username already exists'); })
            );
        }
        if (updateData.email) {
            checks.push(
                User.findOne({ email: updateData.email, _id: { $ne: id } })
                    .then(existing => { if (existing) throw new Error('Email already exists'); })
            );
        }
        await Promise.all(checks);

        // Role update if it comes
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        ).populate('role', 'name description').lean();

        return updatedUser;
    }

    //DELETE
    //async deleteAll() {
    //    const collections = await User.db.listCollections({ name: 'users' }).toArray();
    //    if (!collections.length) return false;
    //    await User.collection.drop();
    //    return true;
    //}

    async deleteByUsernamesAllExceptAdmin() {
        //Deletes everyone except admin username acoount
        const result = await User.deleteMany({ username: { $ne: "admin" } });
        return result.deletedCount; //Deletions quantity
    }

    async deleteById(id) {
        const user = await User.findById(id);

        if (!user) {
            throw new Error(`User with id ${id} not found`);
        }
        if (user.username.toLowerCase() === 'admin') {
            throw new Error("Forbidden target: main administrator's account")
        }

        const deletedUser = await User.findByIdAndDelete(id);
        return deletedUser.toObject();
    }


    //END OF 
}
export default new UserRepository();