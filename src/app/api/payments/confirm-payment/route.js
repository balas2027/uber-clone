
// // app/api/payments/confirm-payment/route.js
// export async function POST(request) {
//   try {
//     const { paymentIntentId, rideRequestId } = await request.json();
    
//     if (!paymentIntentId || !rideRequestId) {
//       return NextResponse.json(
//         { error: "Payment intent ID and ride request ID are required" }, 
//         { status: 400 }
//       );
//     }

//     const supabase = createClient();
    
//     // Get user from auth
//     const { data: { user }, error: authError } = await supabase.auth.getUser();
    
//     if (authError || !user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // Retrieve payment intent from Stripe
//     const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

//     if (paymentIntent.status === "succeeded") {
//       // Update ride request
//       const { error: rideUpdateError } = await supabase
//         .from("ride_requests")
//         .update({
//           payment_completed: true,
//           payment_completed_at: new Date().toISOString(),
//           payment_status: "succeeded",
//         })
//         .eq("id", rideRequestId)
//         .eq("user_id", user.id);

//       if (rideUpdateError) {
//         console.error("Error updating ride request:", rideUpdateError);
//         return NextResponse.json({ error: "Failed to update ride request" }, { status: 500 });
//       }

//       // Update payment history
//       const { error: paymentHistoryError } = await supabase
//         .from("payment_history")
//         .update({
//           payment_status: "succeeded",
//           completed_at: new Date().toISOString(),
//           payment_method: paymentIntent.payment_method_types[0] || "card",
//         })
//         .eq("ride_request_id", rideRequestId);

//       if (paymentHistoryError) {
//         console.error("Error updating payment history:", paymentHistoryError);
//       }

//       // Update driver earnings
//       const { error: earningsError } = await supabase
//         .from("driver_earnings")
//         .update({
//           status: "paid",
//           paid_at: new Date().toISOString(),
//         })
//         .eq("ride_request_id", rideRequestId);

//       if (earningsError) {
//         console.error("Error updating driver earnings:", earningsError);
//       }

//       // Move to ride history if not already there
//       const { data: rideRequest } = await supabase
//         .from("ride_requests")
//         .select("*")
//         .eq("id", rideRequestId)
//         .single();

//       if (rideRequest && rideRequest.driver_id) {
//         // Insert into ride_history
//         const { error: historyError } = await supabase
//           .from("ride_history")
//           .upsert([
//             {
//               ride_request_id: rideRequest.id,
//               user_id: rideRequest.user_id,
//               driver_id: rideRequest.driver_id,
//               pickup_location: rideRequest.pickup_location,
//               dropoff_location: rideRequest.dropoff_location,
//               distance: rideRequest.distance,
//               price: rideRequest.price,
//               completed_at: rideRequest.completed_at,
//               payment_amount: rideRequest.price,
//               payment_status: "succeeded",
//               payment_method: paymentIntent.payment_method_types[0] || "card",
//             }
//           ], 
//           { onConflict: "ride_request_id" });

//         if (historyError) {
//           console.error("Error creating ride history:", historyError);
//         }
//       }

//       return NextResponse.json({ 
//         success: true, 
//         message: "Payment completed successfully" 
//       });

//     } else {
//       // Handle failed payment
//       const { error: paymentFailedError } = await supabase
//         .from("payment_history")
//         .update({
//           payment_status: "failed",
//           failed_at: new Date().toISOString(),
//           error_message: paymentIntent.last_payment_error?.message || "Payment failed",
//         })
//         .eq("ride_request_id", rideRequestId);

//       if (paymentFailedError) {
//         console.error("Error updating failed payment:", paymentFailedError);
//       }

//       // Update ride request
//       const { error: rideUpdateError } = await supabase
//         .from("ride_requests")
//         .update({
//           payment_error: paymentIntent.last_payment_error?.message || "Payment failed",
//         })
//         .eq("id", rideRequestId);

//       if (rideUpdateError) {
//         console.error("Error updating ride request with payment error:", rideUpdateError);
//       }

//       return NextResponse.json(
//         { error: "Payment failed", details: paymentIntent.last_payment_error?.message },
//         { status: 400 }
//       );
//     }

//   } catch (error) {
//     console.error("Error confirming payment:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// app/api/payments/confirm-payment/route.js
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {}, // noop in API routes
      },
    }
  );
}

export async function POST(request) {
  try {
    const { paymentIntentId, rideRequestId } = await request.json();

    if (!paymentIntentId || !rideRequestId) {
      return NextResponse.json(
        { error: "Payment intent ID and ride request ID are required" },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Get user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      // ✅ Update ride request
      await supabase
        .from("ride_requests")
        .update({
          payment_completed: true,
          payment_completed_at: new Date().toISOString(),
          payment_status: "succeeded",
        })
        .eq("id", rideRequestId)
        .eq("user_id", user.id);

      // ✅ Update payment history
      await supabase
        .from("payment_history")
        .update({
          payment_status: "succeeded",
          completed_at: new Date().toISOString(),
          payment_method: paymentIntent.payment_method_types[0] || "card",
        })
        .eq("ride_request_id", rideRequestId);

      // ✅ Update driver earnings
      await supabase
        .from("driver_earnings")
        .update({
          status: "paid",
          paid_at: new Date().toISOString(),
        })
        .eq("ride_request_id", rideRequestId);

      // ✅ Move to ride history
      const { data: rideRequest } = await supabase
        .from("ride_requests")
        .select("*")
        .eq("id", rideRequestId)
        .single();

      if (rideRequest?.driver_id) {
        await supabase.from("ride_history").upsert(
          [
            {
              ride_request_id: rideRequest.id,
              user_id: rideRequest.user_id,
              driver_id: rideRequest.driver_id,
              pickup_location: rideRequest.pickup_location,
              dropoff_location: rideRequest.dropoff_location,
              distance: rideRequest.distance,
              price: rideRequest.price,
              completed_at: rideRequest.completed_at,
              payment_amount: rideRequest.price,
              payment_status: "succeeded",
              payment_method: paymentIntent.payment_method_types[0] || "card",
            },
          ],
          { onConflict: "ride_request_id" }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Payment completed successfully",
      });
    }

    // Handle failed or pending payments
    await supabase
      .from("payment_history")
      .update({
        payment_status: paymentIntent.status,
        failed_at:
          paymentIntent.status === "failed"
            ? new Date().toISOString()
            : null,
        error_message:
          paymentIntent.last_payment_error?.message || "Payment not completed",
      })
      .eq("ride_request_id", rideRequestId);

    return NextResponse.json(
      {
        error: "Payment not successful",
        status: paymentIntent.status,
        details: paymentIntent.last_payment_error?.message,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error confirming payment:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
