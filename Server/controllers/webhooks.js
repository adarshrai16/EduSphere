import { Webhook } from "svix";
import User from "../models/User.js";
import stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

// ===============================
// CLERK WEBHOOK
// ===============================
export const clerkWebhooks = async (req, res) => {
  try {
    // Create Svix webhook instance
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // req.body is a Buffer because we use express.raw()
    const payload = req.body.toString();

    // Verify webhook signature
    const evt = await whook.verify(payload, {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });

    // Get data from verified webhook
    const { data, type } = evt;

    console.log("Clerk webhook received:", type);

    // ===============================
    // USER CREATED
    // ===============================
    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          imageUrl: data.image_url,
        };

        console.log("Creating user:", userData);

        await User.create(userData);

        console.log("User created successfully:", data.id);

        return res.status(200).json({
          success: true,
          message: "User created",
        });
      }

      // ===============================
      // USER UPDATED
      // ===============================
      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
          imageUrl: data.image_url,
        };

        await User.findByIdAndUpdate(data.id, userData);

        console.log("User updated:", data.id);

        return res.status(200).json({
          success: true,
          message: "User updated",
        });
      }

      // ===============================
      // USER DELETED
      // ===============================
      case "user.deleted": {
        await User.findByIdAndDelete(data.id);

        console.log("User deleted:", data.id);

        return res.status(200).json({
          success: true,
          message: "User deleted",
        });
      }

      // ===============================
      // OTHER EVENTS
      // ===============================
      default: {
        console.log("Unhandled Clerk event:", type);

        return res.status(200).json({
          success: true,
          message: "Event received",
        });
      }
    }
  } catch (error) {
    console.error("Clerk webhook error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


// ===============================
// STRIPE INITIALIZE
// ===============================
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);


// ===============================
// STRIPE WEBHOOK
// ===============================
export const stripeWebhooks = async (request, response) => {
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Stripe webhook error:", err.message);

    return response.status(400).send(
      `Webhook Error: ${err.message}`
    );
  }

  // ===============================
  // HANDLE STRIPE EVENTS
  // ===============================
  try {
    switch (event.type) {

      // ===============================
      // PAYMENT SUCCESS
      // ===============================
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        const session = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });

        if (!session.data.length) {
          throw new Error("Checkout session not found");
        }

        const { purchaseId } = session.data[0].metadata;

        const purchaseData = await Purchase.findById(purchaseId);

        if (!purchaseData) {
          throw new Error("Purchase not found");
        }

        const userData = await User.findById(purchaseData.userId);

        if (!userData) {
          throw new Error("User not found");
        }

        const courseData = await Course.findById(
          purchaseData.courseId.toString()
        );

        if (!courseData) {
          throw new Error("Course not found");
        }

        courseData.enrolledStudents.push(userData);
        await courseData.save();

        userData.enrolledCourses.push(courseData._id);
        await userData.save();

        purchaseData.status = "completed";
        await purchaseData.save();

        console.log("Payment successful:", paymentIntentId);

        break;
      }

      // ===============================
      // PAYMENT FAILED
      // ===============================
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id;

        const session = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntentId,
        });

        if (!session.data.length) {
          throw new Error("Checkout session not found");
        }

        const { purchaseId } = session.data[0].metadata;

        const purchaseData = await Purchase.findById(purchaseId);

        if (!purchaseData) {
          throw new Error("Purchase not found");
        }

        purchaseData.status = "failed";
        await purchaseData.save();

        console.log("Payment failed:", paymentIntentId);

        break;
      }

      default:
        console.log(
          `Unhandled Stripe event type: ${event.type}`
        );
    }

    return response.status(200).json({
      received: true,
    });

  } catch (error) {
    console.error("Stripe processing error:", error);

    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};