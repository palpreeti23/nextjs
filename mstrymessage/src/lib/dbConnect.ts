import mongoose from "mongoose";

type connectionObject = {
  isConnected?: number;
};

const connection: connectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("already connected to database");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
    console.log(db);
    connection.isConnected = db.connections[0].readyState;
    console.log(connection.isConnected);
    console.log("DB connected successfully");
  } catch (error) {
    console.log("DB connnection failed", error);
    process.exit();
  }
}

export default dbConnect;
