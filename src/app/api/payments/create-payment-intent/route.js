// // app/api/payments/create-payment-intent/route.js
// import { createClient } from "@/utils/supabase/server";
// import { NextResponse } from "next/server";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: "2023-10-16",
// });

// export async function POST(request) {
//   try {
//     const { rideRequestId } = await request.json();
    
//     if (!rideRequestId) {
//       return NextResponse.json({ error: "Ride request ID is required" }, { status: 400 });
//     }

//     const supabase = createClient();
    
//     // Get user from auth
//     const { data: { user }, error: authError } = await supabase.auth.getUser();
    
//     if (authError || !user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Fetch ride request details
//     const { data: rideRequest, error: rideError } = await supabase
//       .from("ride_requests")
//       .select("*")
//       .eq("id", rideRequestId)
//       .eq("user_id", user.id)
//       .eq("status", "completed")
//       .single();

//     if (rideError || !rideRequest) {
//       return NextResponse.json({ error: "Ride request not found or not completed" }, { status: 404 });
//     }

//     // Check if payment already exists
//     if (rideRequest.payment_completed) {
//       return NextResponse.json({ error: "Payment already completed" }, { status: 400 });
//     }

//     // Create Stripe Payment Intent
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(parseFloat(rideRequest.price) * 100), // Convert to cents
//       currency: "inr",
//       metadata: {
//         rideRequestId: rideRequest.id,
//         userId: user.id,
//         driverId: rideRequest.driver_id,
//       },
//       description: `Ride from ${rideRequest.pickup_location} to ${rideRequest.dropoff_location}`,
//     });

//     // Update ride request with payment intent ID
//     const { error: updateError } = await supabase
//       .from("ride_requests")
//       .update({
//         stripe_payment_intent_id: paymentIntent.id,
//         payment_required: true,
//       })
//       .eq("id", rideRequestId);

//     if (updateError) {
//       console.error("Error updating ride request:", updateError);
//       return NextResponse.json({ error: "Failed to update ride request" }, { status: 500 });
//     }

//     // Update payment history record
//     const { error: paymentUpdateError } = await supabase
//       .from("payment_history")
//       .update({
//         stripe_payment_intent_id: paymentIntent.id,
//         payment_status: "processing",
//       })
//       .eq("ride_request_id", rideRequestId);

//     if (paymentUpdateError) {
//       console.error("Error updating payment history:", paymentUpdateError);
//     }

//     return NextResponse.json({
//       clientSecret: paymentIntent.client_secret,
//       paymentIntentId: paymentIntent.id,
//     });

//   } catch (error) {
//     console.error("Error creating payment intent:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server"; // ✅ use server client
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function POST(request) {
  try {
    const { rideRequestId } = await request.json();

    if (!rideRequestId) {
      return NextResponse.json(
        { error: "Ride request ID is required" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // ✅ Get authenticated user from cookies
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Fetch ride request (must belong to user & be completed)
    const { data: rideRequest, error: rideError } = await supabase
      .from("ride_requests")
      .select("*")
      .eq("id", rideRequestId)
      .eq("user_id", user.id)
      .eq("status", "completed")
      .single();

    if (rideError || !rideRequest) {
      return NextResponse.json(
        { error: "Ride request not found or not completed" },
        { status: 404 }
      );
    }

    // ✅ Prevent duplicate payments
    if (rideRequest.payment_completed) {
      return NextResponse.json(
        { error: "Payment already completed" },
        { status: 400 }
      );
    }

    // ✅ Create Stripe Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(parseFloat(rideRequest.price) * 100), // INR cents
      currency: "inr",
      metadata: {
        rideRequestId: rideRequest.id,
        userId: user.id,
        driverId: rideRequest.driver_id,
      },
      description: `Ride from ${rideRequest.pickup_location} to ${rideRequest.dropoff_location}`,
    });

    // ✅ Update ride request
    const { error: updateError } = await supabase
      .from("ride_requests")
      .update({
        stripe_payment_intent_id: paymentIntent.id,
        payment_required: true,
      })
      .eq("id", rideRequestId);

    if (updateError) {
      console.error("Error updating ride request:", updateError);
      return NextResponse.json(
        { error: "Failed to update ride request" },
        { status: 500 }
      );
    }

    // ✅ Update payment history (if exists)
    const { error: paymentUpdateError } = await supabase
      .from("payment_history")
      .update({
        stripe_payment_intent_id: paymentIntent.id,
        payment_status: "processing",
      })
      .eq("ride_request_id", rideRequestId);

    if (paymentUpdateError) {
      console.error("Error updating payment history:", paymentUpdateError);
      // not critical → continue anyway
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
