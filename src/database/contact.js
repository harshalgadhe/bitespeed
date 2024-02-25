import { DataTypes } from 'sequelize';
import sequelize from '../utils/db.js';

const ContactModel = sequelize.define('Contact', 
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true
        },
        linkedId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        linkPrecedence: {
            type: DataTypes.ENUM('secondary', 'primary'),
            allowNull: false,
            defaultValue:'primary'
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false
        },
        deletedAt: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, 
    {
        timestamps: true,
        paranoid: true
    }
);

export default ContactModel;