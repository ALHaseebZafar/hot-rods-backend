const mongoose = require('mongoose');

// Define the Authorize Schema
const authorizeSchema = new mongoose.Schema(
  {
    // Sensitive Payment Information
    cardNumber: {
      type: String, // Changed from Number to String
      required: [true, 'Card number is required'],
      validate: {
        validator: function (v) {
          // Ensure cardNumber is exactly 16 digits
          return /^\d{16}$/.test(v);
        },
        message: props => `${props.value} is not a valid 16-digit card number!`,
      },
    },
    expirationDate: {
      type: String, // Changed from Date to String
      required: [true, 'Expiration date is required'],
      validate: {
        validator: function (v) {
          // Ensure expirationDate is in MMYY format
          return /^(0[1-9]|1[0-2])\d{2}$/.test(v);
        },
        message: props => `${props.value} is not a valid expiration date! Use MMYY format.`,
      },
    },
    cvv: {
      type: String,
      required: [true, 'CVV is required'],
      validate: {
        validator: function (v) {
          // CVV must be exactly 3 or 4 digits
          return /^\d{3,4}$/.test(v);
        },
        message: props => `${props.value} is not a valid CVV! Must be 3 or 4 digits.`,
      },
    },

    // Personal Information
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    zipCode: {
      type: Number,
      required: [true, 'Zip code is required'],
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    phone: {
      type: String, // Accommodates different phone formats
      required: [true, 'Phone number is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      // unique: true, // Ensures no duplicate emails
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address',
      ],
    },

    // Payment Information
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be positive'],
    },
    transactionId: {
      type: String,
      required: [true, 'Transaction ID is required'],
    },
    tip: {
      type: Number, // Optional tip from the frontend
      default: 0, // Defaults to 0 if not provided
      min: [0, 'Tip cannot be negative'],
    },
    subTotal: {
      type: Number, // Total cost of selected services
      required: [true, 'Subtotal is required'],
      min: [0, 'Subtotal must be positive'],
    },
    grandTotal: {
      type: Number, // Subtotal + Tip
      min: [0, 'Grand total must be positive'],
    },

    // Appointment Information
    date: {
      type: Date, // Date of the appointment
      required: [true, 'Appointment date is required'],
    },
    time: {
      type: String, // Appointment time (e.g., "2:30 PM")
      required: [true, 'Appointment time is required'],
    },
    professional: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Professional', // Reference to the Professional model
      required: [true, 'Professional ID is required'],
    },
    services: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service', // Reference to the Service model
        required: [true, 'At least one service is required'],
      },
    ],
    totalServiceTime: {
      type: String, // Formatted time (e.g., "2 hours 30 minutes")
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and Export the Authorize Model
const Authorize = mongoose.model('Authorize', authorizeSchema);

module.exports = Authorize;
