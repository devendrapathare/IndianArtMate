import mongoose from 'mongoose';

const connectToMongoDB = async () => {
    try {
        // const mongoURI = process.env.MONGO_DB_URI || 'mongodb://localhost:27017/Indian_ArtMate';
        const mongoURI = process.env.MONGO_DB_URI ;
        // const mongoURI = 'mongodb://localhost:27017/Indian_ArtMate';
        // const mongoURI = process.env.MONGO_DB_URI || 'mongodb://localhost:27017/Indian_ArtMate'
        // const mongoURI = 'mongodb://localhost:27017/Indian_ArtMate';

        await mongoose.connect(mongoURI, {
        });

        console.log('Successfully connected to the Indian_ArtMate database');

       

    } catch (error) {
        console.error("Error connecting to MongoDB from connectToMongoDB.js:", error.message || error);
        process.exit(1);
    }
}

export default connectToMongoDB;
