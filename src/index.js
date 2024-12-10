const express = require("express");
require("dotenv").config(); // Load environment variables
require("./db/mongoose"); // Connect to MongoDB

const professionalRouter=require('./routers/professional')
const serviceRouter=require('./routers/service')
const appointmentRouter=require('./routers/appointment')
const orderSummaryRouter=require('./routers/orderSummary')
const inquireRouter=require('./routers/inquire')
const contactUsRouter=require('./routers/contactUs')
const app = express();
const path = require("path");

const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


app.use(professionalRouter);
app.use(serviceRouter);
app.use(appointmentRouter);
app.use(orderSummaryRouter);
app.use(inquireRouter);
app.use(contactUsRouter);
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});