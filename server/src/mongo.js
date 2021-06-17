import mongoose from 'mongoose';

const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/test";

// Options to pass to mongodb to avoid deprecation warnings
const options = {
  useNewUrlParser: true
};

// Function to connect to the database
const conn = () => {
  mongoose.connect(
    mongoUri,
    options
  );
};
// Call it to connect
conn();

// Handle the database connection and retry as needed
const db = mongoose.connection;

db.on("error", err => {
  console.log("There was a problem connecting to mongo: ", err);
  console.log("Trying again");
  setTimeout(() => conn(), 5000);
});
db.once("open", () => console.log("Successfully connected to mongo"));

// Setup a record in the database to retrieve
const { Schema } = mongoose;

const paymentSchema = new Schema(
  {
    uuid: String,
    amount: Number,
    externalId: String,
  },
  {
    timestamps: true
  }
);

export const Payment = mongoose.model("Payment", paymentSchema);
