const express = require("express");
require("dotenv").config(); // Load environment variables
require("./db/mongoose"); // Connect to MongoDB
const cors = require("cors"); // Import cors

const professionalRouter=require('./routers/professional')
const serviceRouter=require('./routers/service')
const appointmentRouter=require('./routers/appointment')
const orderSummaryRouter=require('./routers/orderSummary')
const inquireRouter=require('./routers/inquire')
const contactUsRouter=require('./routers/contactUs')
const authorizeRouter=require('./routers/authorize')
const app = express();
const path = require("path");

const port = process.env.PORT || 5000; // Default to 5000 if PORT is not set


app.use(cors());

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


app.use(professionalRouter);
app.use(serviceRouter);
app.use(appointmentRouter);
app.use(orderSummaryRouter);
app.use(inquireRouter);
app.use(contactUsRouter);
app.use(authorizeRouter);
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});