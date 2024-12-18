const express = require("express");

 const router = new express.Router();
 const { processAuthorizePayment } = require("../utils/authorizePayment.js");
 const  Authorize  =require('../models/authorize.js')

 router.post("/pay", async (req, res) => {
    // Destructure all necessary fields from the request body
    const {  
      firstName,
      lastName,
      address,
      zipCode,
      country,
      phone,
      email,
      amount,
      cardNumber,        // Sensitive information
      expirationDate,    // Sensitive information
      cvv,               // Sensitive information
      city,
      state,
      date,              // Appointment date
      time,              // Appointment time
      professional,      // Professional ID
      services,          // Array of Service IDs
      tip,               // Optional tip
      subTotal,          // Total cost of selected services
      grandTotal,        // subTotal + Tip
      totalServiceTime,  // Formatted time (e.g., "2 hours 30 minutes")
    } = req.body;
  
    // Basic validation to ensure required fields are present
    if (
      !firstName ||
      !lastName ||
      !address ||
      !zipCode ||
      !country ||
      !phone ||
      !email ||
      !amount ||
      !cardNumber ||
      !expirationDate ||
      !cvv ||
      !city ||
      !state ||
      !date ||
      !time ||
      !professional ||
      !services ||
      services.length === 0 ||
      !subTotal ||
      !grandTotal
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }
  
    try {
      // **Important:** Do not store sensitive payment information like cardNumber, expirationDate, or CVV.
      // Ensure that your `processAuthorizePayment` function handles these securely.
  
      // Process the payment
      const makePayment = await processAuthorizePayment({
        cardNumber,
        expirationDate,
        cvv,
        firstName,
        lastName,
        address,
        zipCode,
        country,
        state,
        city,
        phone,
        email,
        amount,
      });
  
      // Check if the payment was successful
      if (makePayment.message === "Payment Failed") {
        console.error(makePayment.errors);
        return res.status(400).json({ message: "Payment Failed, Please try again." });
      }
  
      // Create a new Authorize document with all required fields
      const newAuthorize = new Authorize({
        // Personal Information
       cardNumber,
       expirationDate,
       cvv,
        firstName,
        lastName,
        address,
        zipCode,
        country,
        phone,
        email,
        city,
        state,
        // Payment Information
        amount,
        transactionId: makePayment.transactionId, // Ensure `transactionId` exists in the response
        tip: tip || 0,                            // Default to 0 if not provided
        subTotal,
        grandTotal,
  
        // Appointment Information
        date,
        time,
        professional,
        services,
        totalServiceTime,
      });
  
      // Save the document to the database
      await newAuthorize.save();
  
      // Respond with success message and transaction ID
      res.status(200).json({
        message: "Payment successful",
        transactionId: makePayment.transactionId,
      });
  
    } catch (error) {
      console.error("Error processing payment:", error);
      res.status(500).json({ error: "An error occurred while processing your payment." });
    }
  });
  // GET /pay - Retrieve all payments
router.get("/pay", async (req, res) => {
    try {
      const payments = await Authorize.find()
        .populate("professional", "name") // Adjust fields as necessary
        .populate("services", "title time price ") // Adjust fields as necessary
        // .populate("authorize","date day time cardNumber expirationDate cvv firstname lastname address zipcode country state city phone email amount  ")
  
      res.status(200).json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ error: "An error occurred while fetching payments." });
    }
  });
  
module.exports=router