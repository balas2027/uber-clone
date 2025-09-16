// // app/driver/dashboard/DriverDashboardClient.js
// "use client";
// import { useState, useEffect } from "react";
// import { createClient } from "@/utils/supabase/client";

// export default function DriverDashboardClient({ driver }) {
//   const [status, setStatus] = useState(driver.status || "offline");
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [incomingRequests, setIncomingRequests] = useState([]);
//   const [activeRide, setActiveRide] = useState(null);
//   const [earnings, setEarnings] = useState({ today: 0, week: 0, month: 0 });
//   const [loading, setLoading] = useState(true);
//   const [updating, setUpdating] = useState(false);
//   const supabase = createClient();

//   // Valid status transitions
//   const VALID_STATUSES = [
//     "pending",
//     "accepted",
//     "en_route",
//     "arrived",
//     "picked_up",
//     "completed",
//     "cancelled",
//   ];

//   useEffect(() => {
//     // Get current location
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           setCurrentLocation({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           });
//         },
//         (error) => console.error("Location error:", error)
//       );
//     }

//     // Load existing active ride and pending requests
//     loadActiveRideAndRequests();

//     // Subscribe to ride request changes
//     const channel = supabase
//       .channel("ride_requests_driver")
//       .on(
//         "postgres_changes",
//         {
//           event: "INSERT",
//           schema: "public",
//           table: "ride_requests",
//         },
//         (payload) => {
//           if (payload.new.status === "pending") {
//             setIncomingRequests((prev) => [...prev, payload.new]);
//             playNotification();
//           }
//         }
//       )
//       .on(
//         "postgres_changes",
//         {
//           event: "UPDATE",
//           schema: "public",
//           table: "ride_requests",
//           filter: `driver_id=eq.${driver.id}`,
//         },
//         (payload) => {
//           // Update active ride if it's ours
//           if (payload.new.driver_id === driver.id) {
//             setActiveRide(payload.new);

//             // Remove from pending requests when accepted
//             if (payload.new.status === "accepted") {
//               setIncomingRequests((prev) =>
//                 prev.filter((req) => req.id !== payload.new.id)
//               );
//             }
//           }
//         }
//       )
//       .on(
//         "postgres_changes",
//         {
//           event: "UPDATE",
//           schema: "public",
//           table: "ride_requests",
//         },
//         (payload) => {
//           // Remove accepted rides from pending list for all drivers
//           if (payload.new.status !== "pending") {
//             setIncomingRequests((prev) =>
//               prev.filter((req) => req.id !== payload.new.id)
//             );
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [driver.id]);

//   const loadActiveRideAndRequests = async () => {
//     try {
//       // Check for active ride assigned to this driver
//       const { data: activeRides, error: activeError } = await supabase
//         .from("ride_requests")
//         .select("*")
//         .eq("driver_id", driver.id)
//         .in("status", ["accepted", "en_route", "arrived", "picked_up"])
//         .order("created_at", { ascending: false })
//         .limit(1);

//       if (activeError) {
//         console.error("Error loading active rides:", activeError);
//       } else if (activeRides && activeRides.length > 0) {
//         setActiveRide(activeRides[0]);
//       }

//       // Fetch existing pending requests (only if no active ride)
//       if (!activeRides || activeRides.length === 0) {
//         const { data: pendingRequests, error: pendingError } = await supabase
//           .from("ride_requests")
//           .select("*")
//           .eq("status", "pending")
//           .order("created_at", { ascending: true });

//         if (pendingError) {
//           console.error("Error loading pending requests:", pendingError);
//         } else if (pendingRequests) {
//           setIncomingRequests(pendingRequests);
//         }
//       }
//     } catch (error) {
//       console.error("Error loading ride data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const playNotification = () => {
//     try {
//       const audio = new Audio("/notification-sound.mp3");
//       audio.play().catch((e) => console.log("Audio play failed:", e));
//     } catch (error) {
//       console.log("Audio initialization failed:", error);
//     }
//   };

//   const toggleStatus = async () => {
//     const newStatus = status === "online" ? "offline" : "online";

//     try {
//       const updateData = {
//         status: newStatus,
//       };

//       // Add location data if going online and location is available
//       if (newStatus === "online" && currentLocation) {
//         updateData.current_lat = currentLocation.lat;
//         updateData.current_lng = currentLocation.lng;
//       }

//       const { error } = await supabase
//         .from("driver_profiles")
//         .update(updateData)
//         .eq("id", driver.id);

//       if (error) {
//         console.error("Error updating driver status:", error);
//         return;
//       }

//       setStatus(newStatus);

//       // If going offline, clear pending requests
//       if (newStatus === "offline") {
//         setIncomingRequests([]);
//       } else {
//         // If going online, fetch pending requests
//         loadActiveRideAndRequests();
//       }
//     } catch (error) {
//       console.error("Error toggling status:", error);
//     }
//   };

//   const acceptRide = async (request) => {
//     if (updating) return;

//     setUpdating(true);
//     try {
//       // First, check if the ride is still pending and available
//       const { data: currentRide, error: checkError } = await supabase
//         .from("ride_requests")
//         .select("*")
//         .eq("id", request.id)
//         .eq("status", "pending")
//         .single();

//       if (checkError || !currentRide) {
//         console.log("Ride no longer available");
//         // Remove from local state
//         setIncomingRequests((prev) =>
//           prev.filter((req) => req.id !== request.id)
//         );
//         return;
//       }

//       const updateData = {
//         status: "accepted",
//         driver_id: driver.id,
//         accepted_at: new Date().toISOString(),
//       };

//       const { data, error } = await supabase
//         .from("ride_requests")
//         .update(updateData)
//         .eq("id", request.id)
//         .eq("status", "pending") // Ensure it's still pending
//         .select()
//         .single();

//       if (error) {
//         console.error("Error accepting ride:", error);
//         if (error.code === "23514") {
//           console.error("Invalid status value. Check database constraints.");
//         } else if (error.code === "42501") {
//           console.error("Permission denied. Check RLS policies.");
//         }
//         // Refresh requests to get current state
//         loadActiveRideAndRequests();
//       } else if (data) {
//         setActiveRide(data);
//         setIncomingRequests((prev) =>
//           prev.filter((req) => req.id !== request.id)
//         );
//       }
//     } catch (error) {
//       console.error("Error accepting ride:", error);
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const rejectRide = async (requestId) => {
//     // Just remove from local state - let other drivers see it
//     setIncomingRequests((prev) => prev.filter((req) => req.id !== requestId));
//   };

//   const updateRideStatus = async (newStatus) => {
//     if (!activeRide || updating) return;

//     // Validate status
//     if (!VALID_STATUSES.includes(newStatus)) {
//       console.error("Invalid status:", newStatus);
//       return;
//     }

//     console.log(
//       `Updating ride ${activeRide.id} from ${activeRide.status} to ${newStatus}`
//     );
//     setUpdating(true);

//     try {
//       const updates = {
//         status: newStatus,
//         updated_at: new Date().toISOString(),
//       };

//       // Add timestamps based on status
//       const timestamp = new Date().toISOString();
//       switch (newStatus) {
//         case "en_route":
//           updates.en_route_at = timestamp;
//           break;
//         case "arrived":
//           updates.arrived_at = timestamp;
//           break;
//         case "picked_up":
//           updates.picked_up_at = timestamp;
//           break;
//         case "completed":
//           updates.completed_at = timestamp;
//           break;
//         case "cancelled":
//           updates.cancelled_at = timestamp;
//           updates.driver_id = null; // Clear driver assignment
//           break;
//       }

//       console.log("Updates to apply:", updates);

//       // Direct update since RLS is disabled
//       const { data, error } = await supabase
//         .from("ride_requests")
//         .update(updates)
//         .eq("id", activeRide.id)
//         .select()
//         .single();

//       if (error) {
//         console.error("Database error:", error);
//         throw error;
//       }

//       console.log("Update successful:", data);
//       handleRideUpdateSuccess(data, newStatus);
//     } catch (error) {
//       console.error("Error updating ride status:", error);

//       // Provide specific error messages
//       if (error.code === "23514") {
//         alert(
//           `Invalid status "${newStatus}". Check your database constraints.`
//         );
//       } else if (error.code === "42501") {
//         alert("Permission denied. Check RLS policies.");
//       } else if (error.code === "23502") {
//         alert("Required field is missing. Check your database schema.");
//       } else {
//         alert(
//           `Failed to update ride status: ${error.message || "Unknown error"}`
//         );
//       }

//       // Refresh to get current state
//       loadActiveRideAndRequests();
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const handleRideUpdateSuccess = (data, newStatus) => {
//     if (newStatus === "completed" || newStatus === "cancelled") {
//       setActiveRide(null);
//       // Refresh pending requests
//       if (status === "online") {
//         loadActiveRideAndRequests();
//       }
//     } else {
//       setActiveRide(data);
//     }
//   };

//   const logout = async () => {
//     try {
//       await supabase.auth.signOut();
//       window.location.href = "/driver/login";
//     } catch (error) {
//       console.error("Error signing out:", error);
//     }
//   };

//   const getRideStatusText = (status) => {
//     switch (status) {
//       case "accepted":
//         return "Ride Accepted - Head to pickup";
//       case "en_route":
//         return "En Route to Pickup";
//       case "arrived":
//         return "Arrived at Pickup";
//       case "picked_up":
//         return "Passenger Picked Up";
//       default:
//         return status;
//     }
//   };

//   const getNextAction = (status) => {
//     switch (status) {
//       case "accepted":
//         return {
//           text: "En Route to Pickup",
//           action: () => updateRideStatus("en_route"),
//         };
//       case "en_route":
//         return {
//           text: "Arrived at Pickup",
//           action: () => updateRideStatus("arrived"),
//         };
//       case "arrived":
//         return {
//           text: "Pick up Passenger",
//           action: () => updateRideStatus("picked_up"),
//         };
//       case "picked_up":
//         return {
//           text: "Complete Ride",
//           action: () => updateRideStatus("completed"),
//         };
//       default:
//         return null;
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center h-16">
//             <div className="flex items-center space-x-4">
//               <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
//                 <span className="text-white font-bold">
//                   {driver.full_name?.[0]}
//                 </span>
//               </div>
//               <div>
//                 <h1 className="text-xl font-semibold text-gray-900">
//                   Driver Dashboard
//                 </h1>
//                 <p className="text-sm text-gray-500">{driver.full_name}</p>
//               </div>
//             </div>

//             <div className="flex items-center space-x-4">
//               {/* Status Toggle */}
//               <button
//                 onClick={toggleStatus}
//                 disabled={activeRide} // Can't go offline with active ride
//                 className={`px-4 py-2 rounded-full font-medium transition-colors ${
//                   status === "online"
//                     ? "bg-green-100 text-green-800"
//                     : "bg-gray-100 text-gray-800"
//                 } ${
//                   activeRide
//                     ? "opacity-50 cursor-not-allowed"
//                     : "hover:opacity-80"
//                 }`}
//               >
//                 {status === "online" ? "Online" : "Offline"}
//               </button>

//               <button
//                 onClick={logout}
//                 className="text-gray-500 hover:text-gray-700 transition-colors"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* Driver Stats */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-lg font-semibold text-gray-900 mb-4">
//               Your Stats
//             </h2>
//             <div className="space-y-4">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Rating</span>
//                 <span className="font-semibold">
//                   {driver.rating || "5.0"}/5.0
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Total Rides</span>
//                 <span className="font-semibold">{driver.total_rides || 0}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Status</span>
//                 <span
//                   className={`font-semibold ${
//                     status === "online" ? "text-green-600" : "text-red-600"
//                   }`}
//                 >
//                   {status.charAt(0).toUpperCase() + status.slice(1)}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Today's Earnings</span>
//                 <span className="font-semibold text-green-600">
//                   ₹{earnings.today}
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Active Ride */}
//           {activeRide && (
//             <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">
//                 Current Ride
//               </h2>
//               <div className="bg-blue-50 p-4 rounded-lg">
//                 <div className="flex justify-between items-start mb-4">
//                   <div className="flex-1">
//                     <div className="mb-3">
//                       <span
//                         className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
//                           activeRide.status === "accepted"
//                             ? "bg-yellow-100 text-yellow-800"
//                             : activeRide.status === "en_route"
//                             ? "bg-blue-100 text-blue-800"
//                             : activeRide.status === "arrived"
//                             ? "bg-purple-100 text-purple-800"
//                             : activeRide.status === "picked_up"
//                             ? "bg-green-100 text-green-800"
//                             : "bg-gray-100 text-gray-800"
//                         }`}
//                       >
//                         {getRideStatusText(activeRide.status)}
//                       </span>
//                     </div>

//                     <p className="font-medium mb-1">
//                       From: {activeRide.pickup_location}
//                     </p>
//                     <p className="text-gray-600 mb-1">
//                       To: {activeRide.dropoff_location}
//                     </p>
//                     <p className="text-sm text-gray-500 mb-1">
//                       Distance: {activeRide.distance} km
//                     </p>
//                     <p className="text-sm text-green-600 font-medium mb-3">
//                       Fare: ₹{activeRide.price}
//                     </p>

//                     {/* Timestamps */}
//                     <div className="text-xs text-gray-500 space-y-1">
//                       <p>
//                         Requested:{" "}
//                         {new Date(activeRide.created_at).toLocaleTimeString()}
//                       </p>
//                       {activeRide.accepted_at && (
//                         <p>
//                           Accepted:{" "}
//                           {new Date(
//                             activeRide.accepted_at
//                           ).toLocaleTimeString()}
//                         </p>
//                       )}
//                       {activeRide.en_route_at && (
//                         <p>
//                           En Route:{" "}
//                           {new Date(
//                             activeRide.en_route_at
//                           ).toLocaleTimeString()}
//                         </p>
//                       )}
//                       {activeRide.arrived_at && (
//                         <p>
//                           Arrived:{" "}
//                           {new Date(activeRide.arrived_at).toLocaleTimeString()}
//                         </p>
//                       )}
//                       {activeRide.picked_up_at && (
//                         <p>
//                           Picked Up:{" "}
//                           {new Date(
//                             activeRide.picked_up_at
//                           ).toLocaleTimeString()}
//                         </p>
//                       )}
//                     </div>
//                   </div>

//                   <div className="text-right ml-4">
//                     <p className="text-sm text-gray-600">Passenger</p>
//                     <p className="font-medium">{activeRide.user_name}</p>
//                     <p className="text-sm text-gray-600">
//                       {activeRide.user_phone}
//                     </p>
//                     <a
//                       href={`tel:${activeRide.user_phone}`}
//                       className="inline-block mt-2 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
//                     >
//                       Call
//                     </a>
//                   </div>
//                 </div>

//                 <div className="flex space-x-3">
//                   {(() => {
//                     const nextAction = getNextAction(activeRide.status);
//                     return nextAction ? (
//                       <button
//                         onClick={nextAction.action}
//                         disabled={updating}
//                         className={`bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors ${
//                           updating
//                             ? "opacity-50 cursor-not-allowed"
//                             : "hover:bg-blue-700"
//                         }`}
//                       >
//                         {updating ? "Updating..." : nextAction.text}
//                       </button>
//                     ) : null;
//                   })()}

//                   {/* Cancel button - available for all statuses except picked_up */}
//                   {activeRide.status !== "picked_up" && (
//                     <button
//                       onClick={() => updateRideStatus("cancelled")}
//                       disabled={updating}
//                       className={`bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors ${
//                         updating
//                           ? "opacity-50 cursor-not-allowed"
//                           : "hover:bg-red-700"
//                       }`}
//                     >
//                       {updating ? "Cancelling..." : "Cancel Ride"}
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Incoming Requests */}
//           {!activeRide &&
//             incomingRequests.length > 0 &&
//             status === "online" && (
//               <div className="md:col-span-3 bg-white rounded-lg shadow p-6">
//                 <h2 className="text-lg font-semibold text-gray-900 mb-4">
//                   Incoming Ride Requests ({incomingRequests.length})
//                 </h2>
//                 <div className="space-y-4">
//                   {incomingRequests.map((request) => (
//                     <div
//                       key={request.id}
//                       className="border border-yellow-300 bg-yellow-50 p-4 rounded-lg"
//                     >
//                       <div className="flex justify-between items-start">
//                         <div className="flex-1">
//                           <div className="mb-2">
//                             <span className="text-xs text-gray-500">
//                               Requested{" "}
//                               {new Date(
//                                 request.created_at
//                               ).toLocaleTimeString()}
//                             </span>
//                           </div>
//                           <p className="font-medium">
//                             From: {request.pickup_location}
//                           </p>
//                           <p className="text-gray-600">
//                             To: {request.dropoff_location}
//                           </p>
//                           <p className="text-sm text-gray-500">
//                             Distance: {request.distance} km
//                           </p>
//                           <p className="text-sm text-green-600 font-medium">
//                             Estimated Fare: ₹{request.price}
//                           </p>
//                           <div className="mt-2">
//                             <p className="text-sm text-gray-600">
//                               Passenger: {request.user_name}
//                             </p>
//                             <p className="text-sm text-gray-600">
//                               Phone: {request.user_phone}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="flex space-x-3 ml-4">
//                           <button
//                             onClick={() => acceptRide(request)}
//                             disabled={updating}
//                             className={`bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors ${
//                               updating
//                                 ? "opacity-50 cursor-not-allowed"
//                                 : "hover:bg-green-700"
//                             }`}
//                           >
//                             {updating ? "Accepting..." : "Accept"}
//                           </button>
//                           <button
//                             onClick={() => rejectRide(request.id)}
//                             disabled={updating}
//                             className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium transition-colors"
//                           >
//                             Reject
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//           {/* No active content states */}
//           {!activeRide &&
//             incomingRequests.length === 0 &&
//             status === "online" && (
//               <div className="md:col-span-2 bg-white rounded-lg shadow p-6 text-center">
//                 <div className="text-gray-400 mb-4">
//                   <svg
//                     className="w-16 h-16 mx-auto"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={1}
//                       d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                     />
//                   </svg>
//                 </div>
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">
//                   Waiting for ride requests
//                 </h3>
//                 <p className="text-gray-500">
//                   You're online and ready to receive ride requests
//                 </p>
//               </div>
//             )}

//           {status === "offline" && (
//             <div className="md:col-span-2 bg-white rounded-lg shadow p-6 text-center">
//               <div className="text-gray-400 mb-4">
//                 <svg
//                   className="w-16 h-16 mx-auto"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={1}
//                     d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636"
//                   />
//                 </svg>
//               </div>
//               <h3 className="text-lg font-medium text-gray-900 mb-2">
//                 You're offline
//               </h3>
//               <p className="text-gray-500">
//                 Turn on your status to start receiving ride requests
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// app/driver/dashboard/DriverDashboardClient.js
"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function DriverDashboardClient({ driver }) {
  const [status, setStatus] = useState(driver.status || "offline");
  const [currentLocation, setCurrentLocation] = useState(null);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [activeRide, setActiveRide] = useState(null);
  const [earnings, setEarnings] = useState({
    today: 0,
    week: 0,
    month: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [rideHistory, setRideHistory] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [driverStats, setDriverStats] = useState({
    totalRides: 0,
    totalEarnings: 0,
    pendingPayments: 0,
    completedRides: 0,
  });
  const supabase = createClient();

  // Valid status transitions
  const VALID_STATUSES = [
    "pending",
    "accepted",
    "en_route",
    "arrived",
    "picked_up",
    "completed",
    "cancelled",
  ];

  useEffect(() => {
    // Get current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error("Location error:", error)
      );
    }

    // Load existing active ride and pending requests
    loadActiveRideAndRequests();
    loadDriverStats();
    loadRideHistory();
    loadPaymentHistory();

    // Subscribe to ride request changes
    const channel = supabase
      .channel("ride_requests_driver")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "ride_requests",
        },
        (payload) => {
          if (payload.new.status === "pending") {
            setIncomingRequests((prev) => [...prev, payload.new]);
            playNotification();
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "ride_requests",
          filter: `driver_id=eq.${driver.id}`,
        },
        (payload) => {
          // Update active ride if it's ours
          if (payload.new.driver_id === driver.id) {
            setActiveRide(payload.new);

            // Remove from pending requests when accepted
            if (payload.new.status === "accepted") {
              setIncomingRequests((prev) =>
                prev.filter((req) => req.id !== payload.new.id)
              );
            }

            // Refresh stats and history when ride is completed
            if (payload.new.status === "completed") {
              loadDriverStats();
              loadRideHistory();
              loadPaymentHistory();
            }
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "ride_requests",
        },
        (payload) => {
          // Remove accepted rides from pending list for all drivers
          if (payload.new.status !== "pending") {
            setIncomingRequests((prev) =>
              prev.filter((req) => req.id !== payload.new.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [driver.id]);

  const loadActiveRideAndRequests = async () => {
    try {
      // Check for active ride assigned to this driver
      const { data: activeRides, error: activeError } = await supabase
        .from("ride_requests")
        .select("*")
        .eq("driver_id", driver.id)
        .in("status", ["accepted", "en_route", "arrived", "picked_up"])
        .order("created_at", { ascending: false })
        .limit(1);

      if (activeError) {
        console.error("Error loading active rides:", activeError);
      } else if (activeRides && activeRides.length > 0) {
        setActiveRide(activeRides[0]);
      }

      // Fetch existing pending requests (only if no active ride)
      if (!activeRides || activeRides.length === 0) {
        const { data: pendingRequests, error: pendingError } = await supabase
          .from("ride_requests")
          .select("*")
          .eq("status", "pending")
          .order("created_at", { ascending: true });

        if (pendingError) {
          console.error("Error loading pending requests:", pendingError);
        } else if (pendingRequests) {
          setIncomingRequests(pendingRequests);
        }
      }
    } catch (error) {
      console.error("Error loading ride data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadDriverStats = async () => {
    try {
      // Get total rides
      const { data: ridesData, error: ridesError } = await supabase
        .from("ride_requests")
        .select("id, status, price")
        .eq("driver_id", driver.id)
        .in("status", ["completed", "cancelled"]);

      if (ridesError) throw ridesError;

      const completedRides = ridesData
        ? ridesData.filter((ride) => ride.status === "completed")
        : [];

      // Get earnings data
      const { data: earningsData, error: earningsError } = await supabase
        .from("driver_earnings")
        .select("amount, net_amount, status, created_at")
        .eq("driver_id", driver.id);

      if (earningsError) throw earningsError;

      const totalEarnings = earningsData
        ? earningsData
            .filter((earning) => earning.status === "paid")
            .reduce((sum, earning) => sum + parseFloat(earning.net_amount), 0)
        : 0;

      const pendingPayments = earningsData
        ? earningsData
            .filter((earning) => earning.status === "pending")
            .reduce((sum, earning) => sum + parseFloat(earning.net_amount), 0)
        : 0;

      // Calculate today's earnings
      const today = new Date().toDateString();
      const todayEarnings = earningsData
        ? earningsData
            .filter(
              (earning) =>
                earning.status === "paid" &&
                new Date(earning.created_at).toDateString() === today
            )
            .reduce((sum, earning) => sum + parseFloat(earning.net_amount), 0)
        : 0;

      setDriverStats({
        totalRides: ridesData ? ridesData.length : 0,
        completedRides: completedRides.length,
        totalEarnings: totalEarnings,
        pendingPayments: pendingPayments,
      });

      setEarnings((prev) => ({
        ...prev,
        today: todayEarnings,
        total: totalEarnings,
      }));
    } catch (error) {
      console.error("Error loading driver stats:", error);
    }
  };

  const loadRideHistory = async () => {
    try {
      const { data: historyData, error } = await supabase
        .from("ride_requests")
        .select("*")
        .eq("driver_id", driver.id)
        .in("status", ["completed", "cancelled"])
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      if (historyData) {
        setRideHistory(historyData);
      }
    } catch (error) {
      console.error("Error loading ride history:", error);
    }
  };

  const loadPaymentHistory = async () => {
    try {
      const { data: paymentData, error } = await supabase
        .from("payment_history")
        .select(
          `
          *,
          ride_requests (pickup_location, dropoff_location, distance)
        `
        )
        .eq("driver_id", driver.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      if (paymentData) {
        setPaymentHistory(paymentData);
      }
    } catch (error) {
      console.error("Error loading payment history:", error);
    }
  };

  const playNotification = () => {
    try {
      const audio = new Audio("/notification-sound.mp3");
      audio.play().catch((e) => console.log("Audio play failed:", e));
    } catch (error) {
      console.log("Audio initialization failed:", error);
    }
  };

  const toggleStatus = async () => {
    const newStatus = status === "online" ? "offline" : "online";

    try {
      const updateData = {
        status: newStatus,
      };

      // Add location data if going online and location is available
      if (newStatus === "online" && currentLocation) {
        updateData.current_lat = currentLocation.lat;
        updateData.current_lng = currentLocation.lng;
      }

      const { error } = await supabase
        .from("driver_profiles")
        .update(updateData)
        .eq("id", driver.id);

      if (error) {
        console.error("Error updating driver status:", error);
        return;
      }

      setStatus(newStatus);

      // If going offline, clear pending requests
      if (newStatus === "offline") {
        setIncomingRequests([]);
      } else {
        // If going online, fetch pending requests
        loadActiveRideAndRequests();
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const acceptRide = async (request) => {
    if (updating) return;

    setUpdating(true);
    try {
      // First, check if the ride is still pending and available
      const { data: currentRide, error: checkError } = await supabase
        .from("ride_requests")
        .select("*")
        .eq("id", request.id)
        .eq("status", "pending")
        .single();

      if (checkError || !currentRide) {
        console.log("Ride no longer available");
        // Remove from local state
        setIncomingRequests((prev) =>
          prev.filter((req) => req.id !== request.id)
        );
        return;
      }

      const updateData = {
        status: "accepted",
        driver_id: driver.id,
        accepted_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("ride_requests")
        .update(updateData)
        .eq("id", request.id)
        .eq("status", "pending") // Ensure it's still pending
        .select()
        .single();

      if (error) {
        console.error("Error accepting ride:", error);
        if (error.code === "23514") {
          console.error("Invalid status value. Check database constraints.");
        } else if (error.code === "42501") {
          console.error("Permission denied. Check RLS policies.");
        }
        // Refresh requests to get current state
        loadActiveRideAndRequests();
      } else if (data) {
        setActiveRide(data);
        setIncomingRequests((prev) =>
          prev.filter((req) => req.id !== request.id)
        );
      }
    } catch (error) {
      console.error("Error accepting ride:", error);
    } finally {
      setUpdating(false);
    }
  };

  const rejectRide = async (requestId) => {
    // Just remove from local state - let other drivers see it
    setIncomingRequests((prev) => prev.filter((req) => req.id !== requestId));
  };

  const updateRideStatus = async (newStatus) => {
    if (!activeRide || updating) return;

    // Validate status
    if (!VALID_STATUSES.includes(newStatus)) {
      console.error("Invalid status:", newStatus);
      return;
    }

    console.log(
      `Updating ride ${activeRide.id} from ${activeRide.status} to ${newStatus}`
    );
    setUpdating(true);

    try {
      const updates = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };

      // Add timestamps based on status
      const timestamp = new Date().toISOString();
      switch (newStatus) {
        case "en_route":
          updates.en_route_at = timestamp;
          break;
        case "arrived":
          updates.arrived_at = timestamp;
          break;
        case "picked_up":
          updates.picked_up_at = timestamp;
          break;
        case "completed":
          updates.completed_at = timestamp;
          // Add payment-related fields that might be required by the trigger
          updates.payment_status = updates.payment_status || "pending";
          updates.payment_amount = updates.payment_amount || activeRide.price;
          updates.payment_required = true;
          // Set payment_completed to false initially - it will be updated when payment is actually processed
          updates.payment_completed = false;
          break;
        case "cancelled":
          updates.cancelled_at = timestamp;
          updates.driver_id = null; // Clear driver assignment
          // Optional: add cancellation info
          updates.cancelled_by = "driver";
          updates.cancellation_reason = "Cancelled by driver";
          break;
      }

      console.log("Updates to apply:", updates);

      // Direct update since RLS is disabled
      const { data, error } = await supabase
        .from("ride_requests")
        .update(updates)
        .eq("id", activeRide.id)
        .select()
        .single();

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      console.log("Update successful:", data);
      handleRideUpdateSuccess(data, newStatus);
    } catch (error) {
      console.error("Error updating ride status:", error);

      // Provide specific error messages
      if (error.code === "23514") {
        alert(
          `Invalid status "${newStatus}". Check your database constraints.`
        );
      } else if (error.code === "42501") {
        alert("Permission denied. Check RLS policies.");
      } else if (error.code === "23502") {
        // This is the "Required field is missing" error
        alert(
          `Required field is missing. The payment trigger requires certain fields to be set. Error: ${error.message}`
        );
      } else {
        alert(
          `Failed to update ride status: ${error.message || "Unknown error"}`
        );
      }

      // Refresh to get current state
      loadActiveRideAndRequests();
    } finally {
      setUpdating(false);
    }
  };

  const handleRideUpdateSuccess = (data, newStatus) => {
    if (newStatus === "completed" || newStatus === "cancelled") {
      setActiveRide(null);
      // Refresh pending requests and stats
      if (status === "online") {
        loadActiveRideAndRequests();
        loadDriverStats();
        loadRideHistory();
        loadPaymentHistory();
      }
    } else {
      setActiveRide(data);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.href = "/driver/login";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getRideStatusText = (status) => {
    switch (status) {
      case "accepted":
        return "Ride Accepted - Head to pickup";
      case "en_route":
        return "En Route to Pickup";
      case "arrived":
        return "Arrived at Pickup";
      case "picked_up":
        return "Passenger Picked Up";
      default:
        return status;
    }
  };

  const getNextAction = (status) => {
    switch (status) {
      case "accepted":
        return {
          text: "En Route to Pickup",
          action: () => updateRideStatus("en_route"),
        };
      case "en_route":
        return {
          text: "Arrived at Pickup",
          action: () => updateRideStatus("arrived"),
        };
      case "arrived":
        return {
          text: "Pick up Passenger",
          action: () => updateRideStatus("picked_up"),
        };
      case "picked_up":
        return {
          text: "Complete Ride",
          action: () => updateRideStatus("completed"),
        };
      default:
        return null;
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-orange-600 bg-orange-50";
      case "succeeded":
        return "text-green-600 bg-green-50";
      case "failed":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {driver.full_name?.[0]}
                </span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Driver Dashboard
                </h1>
                <p className="text-sm text-gray-500">{driver.full_name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Status Toggle */}
              <button
                onClick={toggleStatus}
                disabled={activeRide} // Can't go offline with active ride
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  status === "online"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                } ${
                  activeRide
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:opacity-80"
                }`}
              >
                {status === "online" ? "Online" : "Offline"}
              </button>

              <button
                onClick={logout}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex border-b border-gray-200 mt-4">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === "dashboard"
                ? "text-blue-600 border-blue-600"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === "history"
                ? "text-blue-600 border-blue-600"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            Ride History
          </button>
          <button
            onClick={() => setActiveTab("payments")}
            className={`px-6 py-3 text-sm font-medium border-b-2 ${
              activeTab === "payments"
                ? "text-blue-600 border-blue-600"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            Payments
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Driver Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Your Stats
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating</span>
                  <span className="font-semibold">
                    {driver.rating || "5.0"}/5.0
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Rides</span>
                  <span className="font-semibold">
                    {driverStats.totalRides}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Completed Rides</span>
                  <span className="font-semibold">
                    {driverStats.completedRides}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`font-semibold ${
                      status === "online" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Today's Earnings</span>
                  <span className="font-semibold text-green-600">
                    ₹{earnings.today.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Earnings</span>
                  <span className="font-semibold text-green-600">
                    ₹{driverStats.totalEarnings.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending Payments</span>
                  <span className="font-semibold text-orange-600">
                    ₹{driverStats.pendingPayments.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Active Ride */}
            {activeRide && (
              <div className="md:col-span-2 bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Current Ride
                </h2>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="mb-3">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            activeRide.status === "accepted"
                              ? "bg-yellow-100 text-yellow-800"
                              : activeRide.status === "en_route"
                              ? "bg-blue-100 text-blue-800"
                              : activeRide.status === "arrived"
                              ? "bg-purple-100 text-purple-800"
                              : activeRide.status === "picked_up"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {getRideStatusText(activeRide.status)}
                        </span>
                      </div>

                      <p className="font-medium mb-1">
                        From: {activeRide.pickup_location}
                      </p>
                      <p className="text-gray-600 mb-1">
                        To: {activeRide.dropoff_location}
                      </p>
                      <p className="text-sm text-gray-500 mb-1">
                        Distance: {activeRide.distance} km
                      </p>
                      <p className="text-sm text-green-600 font-medium mb-3">
                        Fare: ₹{activeRide.price}
                      </p>

                      {/* Timestamps */}
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>
                          Requested:{" "}
                          {new Date(activeRide.created_at).toLocaleTimeString()}
                        </p>
                        {activeRide.accepted_at && (
                          <p>
                            Accepted:{" "}
                            {new Date(
                              activeRide.accepted_at
                            ).toLocaleTimeString()}
                          </p>
                        )}
                        {activeRide.en_route_at && (
                          <p>
                            En Route:{" "}
                            {new Date(
                              activeRide.en_route_at
                            ).toLocaleTimeString()}
                          </p>
                        )}
                        {activeRide.arrived_at && (
                          <p>
                            Arrived:{" "}
                            {new Date(
                              activeRide.arrived_at
                            ).toLocaleTimeString()}
                          </p>
                        )}
                        {activeRide.picked_up_at && (
                          <p>
                            Picked Up:{" "}
                            {new Date(
                              activeRide.picked_up_at
                            ).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <p className="text-sm text-gray-600">Passenger</p>
                      <p className="font-medium">{activeRide.user_name}</p>
                      <p className="text-sm text-gray-600">
                        {activeRide.user_phone}
                      </p>
                      <a
                        href={`tel:${activeRide.user_phone}`}
                        className="inline-block mt-2 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                      >
                        Call
                      </a>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    {(() => {
                      const nextAction = getNextAction(activeRide.status);
                      return nextAction ? (
                        <button
                          onClick={nextAction.action}
                          disabled={updating}
                          className={`bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors ${
                            updating
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-blue-700"
                          }`}
                        >
                          {updating ? "Updating..." : nextAction.text}
                        </button>
                      ) : null;
                    })()}

                    {/* Cancel button - available for all statuses except picked_up */}
                    {activeRide.status !== "picked_up" && (
                      <button
                        onClick={() => updateRideStatus("cancelled")}
                        disabled={updating}
                        className={`bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors ${
                          updating
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-red-700"
                        }`}
                      >
                        {updating ? "Cancelling..." : "Cancel Ride"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Incoming Requests */}
            {!activeRide &&
              incomingRequests.length > 0 &&
              status === "online" && (
                <div className="md:col-span-3 bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Incoming Ride Requests ({incomingRequests.length})
                  </h2>
                  <div className="space-y-4">
                    {incomingRequests.map((request) => (
                      <div
                        key={request.id}
                        className="border border-yellow-300 bg-yellow-50 p-4 rounded-lg"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="mb-2">
                              <span className="text-xs text-gray-500">
                                Requested{" "}
                                {new Date(
                                  request.created_at
                                ).toLocaleTimeString()}
                              </span>
                            </div>
                            <p className="font-medium">
                              From: {request.pickup_location}
                            </p>
                            <p className="text-gray-600">
                              To: {request.dropoff_location}
                            </p>
                            <p className="text-sm text-gray-500">
                              Distance: {request.distance} km
                            </p>
                            <p className="text-sm text-green-600 font-medium">
                              Estimated Fare: ₹{request.price}
                            </p>
                            <div className="mt-2">
                              <p className="text-sm text-gray-600">
                                Passenger: {request.user_name}
                              </p>
                              <p className="text-sm text-gray-600">
                                Phone: {request.user_phone}
                              </p>
                            </div>
                          </div>

                          <div className="flex space-x-3 ml-4">
                            <button
                              onClick={() => acceptRide(request)}
                              disabled={updating}
                              className={`bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors ${
                                updating
                                  ? "opacity-50 cursor-not-allowed"
                                  : "hover:bg-green-700"
                              }`}
                            >
                              {updating ? "Accepting..." : "Accept"}
                            </button>
                            <button
                              onClick={() => rejectRide(request.id)}
                              disabled={updating}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* No active content states */}
            {!activeRide &&
              incomingRequests.length === 0 &&
              status === "online" && (
                <div className="md:col-span-2 bg-white rounded-lg shadow p-6 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg
                      className="w-16 h-16 mx-auto"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Waiting for ride requests
                  </h3>
                  <p className="text-gray-500">
                    You're online and ready to receive ride requests
                  </p>
                </div>
              )}

            {status === "offline" && (
              <div className="md:col-span-2 bg-white rounded-lg shadow p-6 text-center">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="w-16 h-16 mx-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  You're offline
                </h3>
                <p className="text-gray-500">
                  Turn on your status to start receiving ride requests
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Ride History
            </h2>

            {rideHistory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No ride history yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {rideHistory.map((ride) => (
                  <div
                    key={ride.id}
                    className="border border-gray-200 p-4 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                            ride.status === "completed"
                              ? ride.payment_completed
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {ride.status === "completed"
                            ? ride.payment_completed
                              ? "Completed & Paid"
                              : "Completed (Payment Pending)"
                            : ride.status.charAt(0).toUpperCase() +
                              ride.status.slice(1)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(ride.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm">
                          <strong>From:</strong> {ride.pickup_location}
                        </p>
                        <p className="text-sm">
                          <strong>To:</strong> {ride.dropoff_location}
                        </p>
                        <p className="text-sm">
                          <strong>Distance:</strong> {ride.distance} km
                        </p>
                        <p className="text-sm">
                          <strong>Passenger:</strong> {ride.user_name}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm">
                          <strong>Fare:</strong> ₹{ride.price}
                        </p>
                        <p className="text-sm text-green-600">
                          <strong>Your Earnings:</strong> ₹
                          {(parseFloat(ride.price) * 0.9).toFixed(2)}
                        </p>
                        {ride.completed_at && (
                          <p className="text-xs text-gray-500">
                            Completed:{" "}
                            {new Date(ride.completed_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "payments" && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Payment History
              </h2>
              <div className="flex space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Total Earnings</p>
                  <p className="text-xl font-bold text-green-600">
                    ₹{driverStats.totalEarnings.toFixed(2)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Pending Payments</p>
                  <p className="text-xl font-bold text-orange-600">
                    ₹{driverStats.pendingPayments.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {paymentHistory.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No payment history yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {paymentHistory.map((payment) => (
                  <div
                    key={payment.id}
                    className="border border-gray-200 p-4 rounded-lg"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(
                            payment.payment_status
                          )}`}
                        >
                          {payment.payment_status === "succeeded"
                            ? "Paid"
                            : payment.payment_status.charAt(0).toUpperCase() +
                              payment.payment_status.slice(1)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(payment.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">
                          ₹{payment.amount}
                        </p>
                        <p className="text-sm text-green-600">
                          Your earnings: ₹
                          {(parseFloat(payment.amount) * 0.9).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {payment.ride_requests && (
                      <div className="text-sm text-gray-600">
                        <p>
                          <strong>Route:</strong>{" "}
                          {payment.ride_requests.pickup_location} →{" "}
                          {payment.ride_requests.dropoff_location}
                        </p>
                        <p>
                          <strong>Distance:</strong>{" "}
                          {payment.ride_requests.distance} km
                        </p>
                      </div>
                    )}

                    {payment.payment_method && (
                      <div className="mt-2 text-xs text-gray-500">
                        <p>
                          <strong>Payment Method:</strong>{" "}
                          {payment.payment_method}
                        </p>
                        {payment.completed_at && (
                          <p>
                            <strong>Paid At:</strong>{" "}
                            {new Date(payment.completed_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
