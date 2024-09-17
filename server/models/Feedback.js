import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js'; // Path to your sequelize instance

const Feedback = sequelize.define('Feedback', {
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    customer_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    feedback: {
        type: DataTypes.TEXT,
        allowNull: false // Feedback message is required
    }
}, {
    timestamps: true // Enable createdAt and updatedAt
});

export default Feedback;
