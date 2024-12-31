// const express = require("express");
// const Inquire = require("../models/inquire"); // Import the Inquire model
// const router = new express.Router();

// // Create a new inquiry
// router.post("/inquire", async (req, res) => {
//   try {
//     const { professional, manualBookingDetails,onlineBookingDetails } = req.body;

//     // Create a new inquiry instance
//     const inquire = new Inquire({
//       professional,
//       manualBookingDetails,
//       onlineBookingDetails
//     });

//     // Save the inquiry to the database
//     await inquire.save();

//     // Respond with success
//     res.status(201).send({
//       message: "Inquiry created successfully",
//       inquire,
//     });
//   } catch (e) {
//     // Handle errors
//     res.status(400).send({ error: e.message });
//   }
// });

// // Get all inquiries
// router.get("/inquire", async (req, res) => {
//   try {
//     const inquires = await Inquire.find().populate("professional", "name availability").exec();
//     res.status(200).send({ inquires }); // Always return an empty array instead of 404
//   } catch (e) {
//     console.error("Error fetching inquiries:", e.message);
//     res.status(500).send({ error: e.message });
//   }
// });

// // Get a specific inquiry by professional ID
// router.get("/inquire/", async (req, res) => {
//   try {
//     const { professionalId } = req.params;

//     // Find inquiries by professional ID
//     const inquiries = await Inquire.find({ professional: professionalId })
//       .populate("professional", "name availability notAvailable")
//       .exec();

//     // Check if inquiries exist
//     if (!inquiries || inquiries.length === 0) {
//       return res.status(404).send({ message: "No inquiries found for this professional" });
//     }

//     // Respond with inquiries
//     res.status(200).send({ inquiries });
//   } catch (e) {
//     console.error("Error fetching inquiries:", e.message);
//     res.status(500).send({ error: e.message });
//   }
// });

// // Update an inquiry by ID
// router.patch("/inquire/:professionalId", async (req, res) => {
//   try {
//     const { professionalId } = req.params;
//     // Default to empty arrays if they’re not provided
//     let { manualBookingDetails = [], onlineBookingDetails = [] } = req.body;
//     // 1. Find the inquiry by professional ID
//     let inquire = await Inquire.findOne({ professional: professionalId });
//     // 2. If not found, CREATE a new doc
//     if (!inquire) {
//       inquire = new Inquire({
//         professional: professionalId,
//         manualBookingDetails,
//         onlineBookingDetails,
//       });
//     } else {
//       // If found, you can either overwrite or append:
//       // --- Overwrite version ---
//       // inquire.manualBookingDetails = manualBookingDetails;
//       // inquire.onlineBookingDetails = onlineBookingDetails;
//       // --- Append version ---
//       if (manualBookingDetails.length) {
//         inquire.manualBookingDetails.push(...manualBookingDetails);
//       }
//       if (onlineBookingDetails.length) {
//         inquire.onlineBookingDetails.push(...onlineBookingDetails);
//       }
//     }
//     // 3. Save the inquiry
//     const updatedInquire = await inquire.save();
//     // 4. Populate any needed fields
//     await updatedInquire.populate("professional");
//     // 5. Return either 201 (created) or 200 (updated)
//     res.status(inquire.isNew ? 201 : 200).send({
//       message: inquire.isNew
//         ? "Inquiry created successfully"
//         : "Inquiry updated successfully",
//       inquire: updatedInquire,
//     });
//   } catch (error) {
//     res.status(400).send({ error: error.message });
//   }
// });

// // Delete an inquiry by ID
// router.delete("/inquire/:id", async (req, res) => {
//   try {
//     const { id } = req.params;

//     const inquire = await Inquire.findByIdAndDelete(id);

//     if (!inquire) {
//       return res.status(404).send({ message: "Inquiry not found" });
//     }

//     res.status(200).send({
//       message: "Inquiry deleted successfully",
//       inquire,
//     });
//   } catch (e) {
//     res.status(500).send({ error: e.message });
//   }
// });

// module.exports = router;

const express = require("express");
const Inquire = require("../models/inquire"); // Import the Inquire model
const router = new express.Router();
// Create a new inquiry
router.post("/inquire", async (req, res) => {
  try {
    const { professional, manualBookingDetails, onlineBookingDetails } =
      req.body;
    // Create a new inquiry instance
    const inquire = new Inquire({
      professional,
      manualBookingDetails,
      onlineBookingDetails,
    });
    // Save the inquiry to the database
    await inquire.save();
    // Respond with success
    res.status(201).send({
      message: "Inquiry created successfully",
      inquire,
    });
  } catch (e) {
    // Handle errors
    res.status(400).send({ error: e.message });
  }
});
// Get all inquiries
// Get ALL inquiries (no professionalId provided)
router.get("/inquire", async (req, res) => {
  try {
    const inquires = await Inquire.find()
      .populate("professional", "name availability")
      .exec();
    // If there are no documents at all, 'inquires' will be an empty array []
    res.status(200).send({ inquires });
  } catch (e) {
    console.error("Error fetching inquiries:", e.message);
    res.status(500).send({ error: e.message });
  }
});
// Get a specific inquiry by professional ID
router.get("/inquire/:professionalId", async (req, res) => {
  try {
    const { professionalId } = req.params;
    // Find inquiries by professional ID
    const inquiries = await Inquire.find({ professional: professionalId })
      .populate("professional", "name availability notAvailable")
      .exec();
    // If no inquiries exist, return a "dummy" record with empty arrays
    if (!inquiries || inquiries.length === 0) {
      return res.status(200).send({
        message:
          "No inquiries found for this professional. Returning empty arrays.",
        inquiries: [
          {
            professional: professionalId,
            manualBookingDetails: [],
            onlineBookingDetails: [],
          },
        ],
      });
    }
    // Otherwise, respond with the actual inquiries
    res.status(200).send({ inquiries });
  } catch (e) {
    console.error("Error fetching inquiries:", e.message);
    res.status(500).send({ error: e.message });
  }
});
// Update an inquiry by ID
router.patch("/inquire/:professionalId", async (req, res) => {
  try {
    const { professionalId } = req.params;
    const { manualBookingDetails, onlineBookingDetails } = req.body;
    // 1. Find the inquiry by professional ID
    let inquire = await Inquire.findOne({ professional: professionalId });
    // 2. If none exists, create a new doc with default empty arrays
    if (!inquire) {
      inquire = new Inquire({
        professional: professionalId,
        manualBookingDetails: manualBookingDetails || [],
        onlineBookingDetails: onlineBookingDetails || [],
      });
    } else {
      // 3. If one does exist, either append or overwrite:
      // Overwrite version:
      //   inquire.manualBookingDetails = manualBookingDetails || [];
      //   inquire.onlineBookingDetails = onlineBookingDetails || [];
      // Append version:
      if (manualBookingDetails?.length) {
        inquire.manualBookingDetails.push(...manualBookingDetails);
      }
      if (onlineBookingDetails?.length) {
        inquire.onlineBookingDetails.push(...onlineBookingDetails);
      }
    }
    // 4. Save the inquiry
    const updatedInquire = await inquire.save();
    await updatedInquire.populate("professional");
    // 5. Return 201 if it was newly created, otherwise 200
    res.status(inquire.isNew ? 201 : 200).send({
      message: inquire.isNew
        ? "Inquiry created successfully"
        : "Inquiry updated successfully",
      inquire: updatedInquire,
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});
// Delete an inquiry by ID
router.delete("/inquire/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const inquire = await Inquire.findByIdAndDelete(id);
    if (!inquire) {
      return res.status(404).send({ message: "Inquiry not found" });
    }
    res.status(200).send({
      message: "Inquiry deleted successfully",
      inquire,
    });
  } catch (e) {
    res.status(500).send({ error: e.message });
  }
});
module.exports = router;