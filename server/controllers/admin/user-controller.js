const User = require('../../models/User'); // Adjust the path as necessary

// Get all users and their data
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, { password: 0 }); // Exclude passwords for security

        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching users.',
        });
    }
};

// Update user role
const updateUserRole = async (req, res) => {
    const { userId } = req.params;
    const { role } = req.body;

    const validRoles = ['admin', 'user', 'product']; // Define your roles
    if (!validRoles.includes(role)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid role provided.',
        });
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { role },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found.',
            });
        }

        res.status(200).json({
            success: true,
            message: 'User role updated successfully.',
            data: updatedUser,
        });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while updating the user role.',
        });
    }
};

module.exports = { getAllUsers, updateUserRole };
