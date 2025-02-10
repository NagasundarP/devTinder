const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://Naga:Admin@cluster0.idbsl.mongodb.net/devTinder"
    );
};

module.exports = connectDB;