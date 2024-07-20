import { DataTypes } from 'sequelize';
import sequelize from '../config/initials.js';

const generateCategoryId = () => {
    return 'CAT-' + Math.random().toString(36).substring(2, 9).toUpperCase();
};

const Category = sequelize.define('Category', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
}, {
    tableName: 'category',
    // hooks: {
    //     beforeCreate: (category, options) => {
    //         category.categoryId = generateCategoryId();
    //     }
    // }
});

export default Category;
