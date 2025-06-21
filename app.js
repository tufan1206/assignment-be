require ("dotenv").config();
const express = require("express");
const cors = require("cors"); 
const app = express();

const connectDB = require("./db/connect");
const product_route = require("./routes/useRoute");

const PORT = process.env.PORT || 5000;


app.use(cors()); // allow frontend access
app.use(express.json()); // parse JSON bodies


app.use("/api/products", product_route);


const Start = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    app.listen(PORT, () => {
      console.log(`Server is listening at port: ${PORT} `);
    });
  } catch (error) {
    console.log(error);
  }
};

Start();
