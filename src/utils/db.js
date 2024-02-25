import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.DATABASE_URI);

export const connectDB = async() => {
    try {
        await sequelize.authenticate();
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

export default sequelize;