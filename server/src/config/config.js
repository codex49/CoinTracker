import mongoose from 'mongoose';

export const connectDB = () => {
    mongoose
        .connect(process.env.MONGO_STRING)
        .then(() => {
            console.log("Database Connected");
        })
        .catch((error) => {
            console.log("Database connection error");
            console.error(error);
            process.exit(1);
        });
};