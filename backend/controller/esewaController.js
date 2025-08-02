const crypto = require("crypto");
const { v4 } = require("uuid");

exports.createOrder = async (req, res, next) => {
  const { amount, cartId } = req.body; // Get cartId and amount from request body
  const orderId = req.params.id; // Use order ID from params
  const transactionUuid = v4(); // Generate unique transaction ID

  //console.log("Creating order for cart:", cartId, "Amount:", amount);

  const signature = createSignature(
    `total_amount=${amount},transaction_uuid=${transactionUuid},product_code=EPAYTEST`
  );

  const formData = {
    amount: amount,
    failure_url: `https://localhost:5000/payment-failed`, // Update failure URL
    product_delivery_charge: "0",
    product_service_charge: "0",
    product_code: "EPAYTEST",
    signature: signature,
    signed_field_names: "total_amount,transaction_uuid,product_code",
    success_url: `https://localhost:5000/payment-success`, // Update success URL
    tax_amount: "0",
    total_amount: amount,
    transaction_uuid: transactionUuid,
  };

  res.json({
    message: "Order Created Successfully",
    formData,
    payment_method: "esewa",
  });
};

exports.verifyPayment = async (req, res, next) => {
  try {
    const { data } = req.query;
    const decodedData = JSON.parse(
      Buffer.from(data, "base64").toString("utf-8")
    );
    //console.log("Esewa Payment Verification Data:", decodedData);

    if (decodedData.status !== "COMPLETE") {
      return res.status(400).json({ message: "Payment verification failed" });
    }

    const message = decodedData.signed_field_names
      .split(",")
      .map((field) => `${field}=${decodedData[field] || ""}`)
      .join(",");

    //console.log("Payment verification message:", message);

    const orderId = decodedData.transaction_uuid.split("-")[0]; // Extract order ID
    //console.log("Verified Order ID:", orderId);

    if (decodedData.status !== "COMPLETE") {
      //console.log("Payment not completed");
      return res.redirect(`https://localhost:3000/payment-failed`);
    }

    res.redirect("https://localhost:3000/payment-success");
  } catch (err) {
    console.error("Esewa Verification Error:", err.message);
    return res.status(400).json({ error: err?.message || "Payment verification error" });
  }
};

// Function to create HMAC signature
const createSignature = (message) => {
  const secret = "8gBm/:&EnhH.1/q"; // Keep this secret safe
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(message);
  return hmac.digest("base64");
};

