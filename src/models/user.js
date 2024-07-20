import { DataTypes } from "sequelize";
import sequelize from '../config/initials.js';

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [8],
                msg: "Password must be at least 8 characters long"
            }
        }
    },
    role: {
        type: DataTypes.ENUM,
        values: ["ADMIN", "USER"],
        defaultValue: "USER",
        allowNull: false
    },

    imgUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },

    imgPublicId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'users'
});


export default User;
