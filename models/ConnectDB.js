const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true,
            useUnifiedTopology: true,
        });
        console.log("Successfully connected to DB");
    } catch (err) {
        console.log("Error connecting DB", err);
    }
};

module.exports = connectDB;