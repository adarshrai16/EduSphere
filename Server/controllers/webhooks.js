import { Webhook } from "svix";
import User from "../models/User.js";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";
import { CourseProgress } from "../models/CourseProgress.js";
import { getStripeClient } from "../utils/stripeClient.js";

const getClerkProfile = (data) => {
  const primaryEmail = data.email_addresses?.find(
    (address) => address.id === data.primary_email_address_id
  )?.email_address;

  return {
    email: primaryEmail || data.email_addresses?.[0]?.email_address || '',
    name: `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'User',
    imageUrl: data.image_url || '',
  };
};

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
        await User.findByIdAndUpdate(
          data.id,
          {
            $set: getClerkProfile(data),
            $setOnInsert: { enrolledCourses: [] },
          },
          { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
        );

        console.log("User synced:", data.id);

        return res.status(200).json({
          success: true,
          message: "User created",
        });
      }

      // ===============================
      // USER UPDATED
      // ===============================
      case "user.updated": {
        await User.findByIdAndUpdate(data.id, {
          $set: getClerkProfile(data),
          $setOnInsert: { enrolledCourses: [] },
        }, {
          upsert: true,
          new: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        });

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
        await Promise.all([
          User.findByIdAndDelete(data.id),
          Course.updateMany(
            { $or: [{ enrolledStudents: data.id }, { "courseRatings.userId": data.id }] },
            {
              $pull: {
                enrolledStudents: data.id,
                courseRatings: { userId: data.id },
              },
            }
          ),
          CourseProgress.deleteMany({ userId: data.id }),
        ]);

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


const getPurchaseIdForPaymentIntent = async (stripeClient, paymentIntent) => {
  if (paymentIntent.metadata?.purchaseId) return paymentIntent.metadata.purchaseId;

  const purchase = await Purchase.findOne({ stripePaymentIntentId: paymentIntent.id }).select('_id');
  if (purchase) return purchase._id.toString();

  const sessions = await stripeClient.checkout.sessions.list({
    payment_intent: paymentIntent.id,
    limit: 1,
  });

  return sessions.data[0]?.metadata?.purchaseId;
};

const completePurchase = async ({ purchaseId, sessionId, paymentIntentId, event }) => {
  if (!purchaseId) throw new Error('Purchase ID is missing from the Stripe event');

  const purchase = await Purchase.findById(purchaseId);
  if (!purchase) throw new Error('Purchase not found');

  const [user, course] = await Promise.all([
    User.findById(purchase.userId),
    Course.findById(purchase.courseId),
  ]);

  if (!user || !course) throw new Error('Purchase user or course not found');

  await Promise.all([
    User.updateOne({ _id: user._id }, { $addToSet: { enrolledCourses: course._id } }),
    Course.updateOne({ _id: course._id }, { $addToSet: { enrolledStudents: user._id } }),
  ]);

  await Purchase.updateOne(
    { _id: purchase._id },
    {
      $set: {
        status: 'completed',
        ...(sessionId ? { stripeSessionId: sessionId } : {}),
        ...(paymentIntentId ? { stripePaymentIntentId: paymentIntentId } : {}),
        stripeLastEventId: event.id,
        stripeLastEventType: event.type,
      },
    }
  );
};

const recordFailedPurchase = async ({ purchaseId, paymentIntentId, event }) => {
  if (!purchaseId) throw new Error('Purchase ID is missing from the Stripe event');

  await Purchase.updateOne(
    { _id: purchaseId, status: { $ne: 'completed' } },
    {
      $set: {
        status: 'failed',
        ...(paymentIntentId ? { stripePaymentIntentId: paymentIntentId } : {}),
        stripeLastEventId: event.id,
        stripeLastEventType: event.type,
      },
    }
  );
};

export const stripeWebhooks = async (request, response) => {
  const sig = request.headers['stripe-signature'];
  let stripeClient;
  let event;

  try {
    stripeClient = getStripeClient();
    event = stripeClient.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('Stripe webhook error:', error.message);
    return response.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object;
        const paymentIntentId = typeof session.payment_intent === 'string'
          ? session.payment_intent
          : session.payment_intent?.id;

        if (session.payment_status === 'paid' || event.type === 'checkout.session.async_payment_succeeded') {
          await completePurchase({
            purchaseId: session.metadata?.purchaseId,
            sessionId: session.id,
            paymentIntentId,
            event,
          });
        } else {
          await Purchase.updateOne(
            { _id: session.metadata?.purchaseId, status: 'pending' },
            {
              $set: {
                stripeSessionId: session.id,
                ...(paymentIntentId ? { stripePaymentIntentId: paymentIntentId } : {}),
                stripeLastEventId: event.id,
                stripeLastEventType: event.type,
              },
            }
          );
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        const purchaseId = await getPurchaseIdForPaymentIntent(stripeClient, paymentIntent);
        await completePurchase({
          purchaseId,
          paymentIntentId: paymentIntent.id,
          event,
        });
        break;
      }

      case 'payment_intent.payment_failed':
      case 'checkout.session.async_payment_failed':
      case 'checkout.session.expired': {
        const failedPayment = event.data.object;
        const paymentIntentId = typeof failedPayment.payment_intent === 'string'
          ? failedPayment.payment_intent
          : failedPayment.payment_intent?.id;
        const purchaseId = failedPayment.metadata?.purchaseId
          || (paymentIntentId
            ? await getPurchaseIdForPaymentIntent(stripeClient, { id: paymentIntentId, metadata: failedPayment.metadata })
            : undefined);

        await recordFailedPurchase({ purchaseId, paymentIntentId, event });
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return response.status(200).json({ received: true });
  } catch (error) {
    console.error('Stripe processing error:', error);
    return response.status(500).json({ success: false, message: error.message });
  }
};