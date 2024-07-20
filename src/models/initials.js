import sequelize from '../config/initials.js';
import Category from './category.js';
import Coupon from './coupon.js';
import Product from './product.js';

// Define associations
Product.belongsTo(Category);

Category.hasMany(Product);

Product.belongsTo(Coupon);

// Initialize models
const initModels = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export default initModels;
