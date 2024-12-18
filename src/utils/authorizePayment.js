const { APIContracts, APIControllers } =require ("authorizenet");
const dotenv = require('dotenv');
dotenv.config();
const nodemailer =require ('nodemailer')




// Set up nodemailer transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'mirzatalhahaidr@gmail.com',
        pass: 'tfpb yiop bpok tcwb',
    },
});
const sendEmail = async (email, subject, body) => {
    const mailOptions = {
        from: 'mirzatalhahaidr@gmail.com',
        to: email,
        subject: subject,
        html: body, // Email content in HTML format
    };
    await transporter.sendMail(mailOptions);
};

 const processAuthorizePayment = async ({
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
  registrationId,
}) => {
  return new Promise((resolve, reject) => {
    const merchantAuthentication =
      new APIContracts.MerchantAuthenticationType();
    merchantAuthentication.setName(
  "5c4XmuY23f"
    );
    merchantAuthentication.setTransactionKey(
   "6p2B3BfWkmH287Vf"
    );
    const creditCard = new APIContracts.CreditCardType();
    creditCard.setCardNumber(cardNumber);
    creditCard.setExpirationDate(expirationDate);
    creditCard.setCardCode(cvv);
    const paymentType = new APIContracts.PaymentType();
    paymentType.setCreditCard(creditCard);
    const billingAddress = new APIContracts.CustomerAddressType();
    billingAddress.setFirstName(firstName);
    billingAddress.setLastName(lastName);
    billingAddress.setAddress(address);
    billingAddress.setZip(zipCode);
    billingAddress.setCountry(country);
    billingAddress.setPhoneNumber(phone);
    billingAddress.setEmail(email);
    billingAddress.setCity("vhjh");
    billingAddress.setState("ghfhfh");
    const transactionRequest = new APIContracts.TransactionRequestType();
    transactionRequest.setTransactionType(
      APIContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION
    );
    transactionRequest.setAmount(amount);
    transactionRequest.setPayment(paymentType);
    transactionRequest.setBillTo(billingAddress);
    const createRequest = new APIContracts.CreateTransactionRequest();
    createRequest.setMerchantAuthentication(merchantAuthentication);
    createRequest.setTransactionRequest(transactionRequest);
    const ctrl = new APIControllers.CreateTransactionController(
      createRequest.getJSON()
    );
    ctrl.execute(async () => {
      const apiResponse = ctrl.getResponse();
      const response = new APIContracts.CreateTransactionResponse(apiResponse);
      if (
        response &&
        response.getMessages().getResultCode() ===
          APIContracts.MessageTypeEnum.OK
      ) {
        const transactionResponse = response.getTransactionResponse();
        if (transactionResponse) {
          try {
            // Send success email
            await sendEmail(
              email,
              "Payment Successful - Music Program",
              `
            <p>Dear ${firstName} ${lastName},</p>
    <p>Thank you for completing your payment of <strong>$${amount}</strong> for the Music Program at <strong>Southlake Tutoring</strong>. We are thrilled to confirm that your registration has been successfully processed.</p>
    <p><b>Your Registration ID:</b> ${registrationId}</p>
    <p>Our Music Program is designed to inspire creativity, nurture talent, and build confidence in every participant. Whether you are beginning your musical journey or refining your skills, our experienced instructors and engaging curriculum will help you achieve your goals. By joining this program, you’re taking a significant step toward exploring the joy and discipline of music.</p>
    <p>If you have any questions about your registration or the program details, please feel free to contact us. You can reach us at <a href="mailto:support@southlaketutoring.com">support@southlaketutoring.com</a> or call us at (123) 456-7890. We’re here to assist you every step of the way.</p>
    <p>We look forward to having you in the Music Program and witnessing your progress as part of our community. Thank you for choosing Southlake Tutoring to support your musical aspirations.</p>
    <p>Warm regards,</p>
    <p><strong>Southlake Tutoring Team</strong></p>
    <p><i>Empowering Creativity, Building Futures</i></p>
`
            );
            resolve({
              message: "Payment Successful",
              transactionId: transactionResponse.getTransId(),
              billingDetails: {
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
              },
            });
          } catch (emailError) {
            console.error("Error sending email:", emailError);
            reject({ message: "Payment processed, but email failed to send." });
          }
        } else {
          reject({
            message: "Payment Failed",
            errors: [
              {
                errorCode: "NoTransactionResponse",
                errorText: "No transaction response received",
              },
            ],
          });
        }
      } else {
        const errors = response.getTransactionResponse()?.getErrors() || [];
        reject({
          message: "Payment Failed",
          resultCode: response.getMessages()?.getResultCode(),
          messageText: response.getMessages()?.getMessage()[0]?.getText(),
          errors: errors.map((err) => ({
            errorCode: err.getErrorCode(),
            errorText: err.getErrorText(),
          })),
        });
      }
    });
  });
};

module.exports = { processAuthorizePayment };
