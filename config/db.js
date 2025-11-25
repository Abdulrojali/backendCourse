// const mongoose = require("mongoose");
// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.url_db)
//     console.log("✅ MongoDB connected...");
//   } catch (err) {
//     console.error("❌ MongoDB connection error:", err.message);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;

const mongoose = require("mongoose");

const connectDB = async () => {
  const dbUri = process.env.url_db_Lokal;
  if (!dbUri) {
    console.error("❌ MongoDB connection error: url_db environment variable is not set!");
    process.exit(1);
  }

  try {
    await mongoose.connect(dbUri);
    console.log("✅ MongoDB connected...");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;


// {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
// }