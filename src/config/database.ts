// Setup Sequelize
import { Sequelize } from 'sequelize';


const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'
});


// Test Connection and Sync
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


// Sync
sequelize
    .sync()
    .then(() => {
        console.log('Database synced successfully.');
    })
    .catch(err => {
        console.error('Unable to sync database:', err);
    });


// Export
export default sequelize