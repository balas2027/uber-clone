// // app/profile/ProfileClient.js
// "use client";
// import { useState } from "react";
// import dynamic from "next/dynamic";
// import { updateProfile, updatePassword, logout } from "./action";

// const RoutingMap = dynamic(() => import("./RoutingMap"), { ssr: false });

// export default function ProfileClient({ user, profile, searchParams }) {
//   const [from, setFrom] = useState("");
//   const [to, setTo] = useState("");
//   const [coords, setCoords] = useState({ from: null, to: null });
//   const [activeTab, setActiveTab] = useState("profile");
//   const [searchHistory, setSearchHistory] = useState([]);

//   const [distance, setDistance] = useState(null);

//   function handleDistanceUpdate(newDistance) {
//     setDistance(newDistance);
//   }

//   async function geocodePlace(place) {
//     const res = await fetch(
//       `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//         place
//       )}`
//     );
//     const data = await res.json();
//     if (data.length > 0)
//       return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
//     return null;
//   }

//   async function handleSearch() {
//     const fromCoords = await geocodePlace(from);
//     const toCoords = await geocodePlace(to);
//     if (fromCoords && toCoords) {
//       setCoords({ from: fromCoords, to: toCoords });

//       // Add to search history (avoid duplicates)
//       const newSearch = { from, to, timestamp: new Date().toLocaleString() };
//       setSearchHistory((prev) => {
//         // Check if this search already exists
//         const exists = prev.some(
//           (search) => search.from === from && search.to === to
//         );
//         if (!exists) {
//           // Keep only last 10 searches
//           return [newSearch, ...prev.slice(0, 9)];
//         }
//         return prev;
//       });
//     } else {
//       alert("One of the locations could not be found.");
//     }
//   }

//   function handleHistoryClick(historyItem) {
//     setFrom(historyItem.from);
//     setTo(historyItem.to);
//     // Clear current coordinates first, then set new ones
//     setCoords({ from: null, to: null });

//     setTimeout(async () => {
//       const fromCoords = await geocodePlace(historyItem.from);
//       const toCoords = await geocodePlace(historyItem.to);
//       if (fromCoords && toCoords) {
//         setTimeout(() => {
//           setCoords({ from: fromCoords, to: toCoords });
//         }, 100);
//       }
//     }, 100);
//   }

//   const error = searchParams?.error;
//   const message = searchParams?.message;

//   return (
//     <div className="min-h-screen bg-white flex">
//       {/* Left Sidebar */}
//       <div className="w-96 bg-white shadow-lg flex flex-col">
//         {/* Header */}
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-black rounded flex items-center justify-center">
//               <span className="text-white font-bold text-lg">U</span>
//             </div>
//             <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
//           </div>
//         </div>

//         {/* Tab Navigation */}
//         <div className="flex border-b border-gray-200">
//           <button
//             onClick={() => setActiveTab("profile")}
//             className={`flex-1 px-6 py-4 text-sm font-medium ${
//               activeTab === "profile"
//                 ? "text-black border-b-2 border-black"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             Profile
//           </button>
//           <button
//             onClick={() => setActiveTab("trip")}
//             className={`flex-1 px-6 py-4 text-sm font-medium ${
//               activeTab === "trip"
//                 ? "text-black border-b-2 border-black"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             Find a trip
//           </button>
//         </div>

//         {/* Content Area */}
//         <div className="flex-1 overflow-y-auto">
//           {activeTab === "profile" && (
//             <div className="p-6 space-y-6">
//               {/* Messages */}
//               {error && (
//                 <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
//                   {error}
//                 </div>
//               )}
//               {message && (
//                 <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
//                   {message}
//                 </div>
//               )}

//               {/* Profile Info */}
//               <div className="space-y-4">
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
//                     Email
//                   </p>
//                   <p className="text-lg text-gray-900">{user.email}</p>
//                 </div>

//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
//                     Username
//                   </p>
//                   <p className="text-lg text-gray-900">
//                     {profile?.username || "Not set"}
//                   </p>
//                 </div>

//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
//                     Phone
//                   </p>
//                   <p className="text-lg text-gray-900">
//                     {profile?.phone || "Not set"}
//                   </p>
//                 </div>

//                 {/* <div className="bg-gray-50 p-4 rounded-lg">
//                   <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
//                     User ID
//                   </p>
//                   <p className="text-sm text-gray-600 font-mono">{user.id}</p>
//                 </div> */}
//               </div>

//               {/* Update Profile Form */}
//               <div className="space-y-4">
//                 <h2 className="text-lg font-semibold text-gray-900">
//                   Update Profile
//                 </h2>
//                 <form action={updateProfile} className="space-y-4">
//                   <input
//                     name="username"
//                     placeholder={`Current: ${profile?.username || "Not set"}`}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent outline-none"
//                   />
//                   <input
//                     name="phone"
//                     placeholder={`Current: ${profile?.phone || "Not set"}`}
//                     type="tel"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent outline-none"
//                   />
//                   <button
//                     type="submit"
//                     className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition duration-200"
//                   >
//                     Update Profile
//                   </button>
//                 </form>
//               </div>

//               {/* Update Password Form */}
//               <div className="space-y-4">
//                 <h2 className="text-lg font-semibold text-gray-900">
//                   Change Password
//                 </h2>
//                 <form action={updatePassword} className="space-y-4">
//                   <input
//                     name="password"
//                     type="password"
//                     placeholder="New Password (min 6 characters)"
//                     minLength="6"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent outline-none"
//                   />
//                   <button
//                     type="submit"
//                     className="w-full bg-gray-900 text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition duration-200"
//                   >
//                     Change Password
//                   </button>
//                 </form>
//               </div>

//               {/* Logout Button */}
//               <form action={logout}>
//                 <button
//                   type="submit"
//                   className="w-full bg-red-600 text-white font-medium py-3 rounded-lg hover:bg-red-500 transition duration-200"
//                 >
//                   Logout
//                 </button>
//               </form>
//             </div>
//           )}

//           {activeTab === "trip" && (
//             <div className="p-6 space-y-4">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">
//                 Find a trip
//               </h2>

//               <div className="space-y-4">
//                 {/* Pick-up location */}
//                 <div className="relative">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
//                     <input
//                       type="text"
//                       value={from}
//                       onChange={(e) => setFrom(e.target.value)}
//                       placeholder="Pick-up location"
//                       className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent outline-none"
//                     />
//                   </div>
//                 </div>

//                 {/* Drop-off location */}
//                 <div className="relative">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-3 h-3 bg-black rounded-sm"></div>
//                     <input
//                       type="text"
//                       value={to}
//                       onChange={(e) => setTo(e.target.value)}
//                       placeholder="Drop-off location"
//                       className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent outline-none"
//                     />
//                     <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200">
//                       <span className="text-lg">+</span>
//                     </button>
//                   </div>
//                 </div>

//                 {/* Time selector */}
//                 <div className="flex items-center space-x-3">
//                   <div className="w-3 h-3"></div>
//                   <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                       />
//                     </svg>
//                     <span>Pick up now</span>
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M19 9l-7 7-7-7"
//                       />
//                     </svg>
//                   </button>
//                 </div>

//                 {/* For me selector */}
//                 <div className="flex items-center space-x-3">
//                   <div className="w-3 h-3"></div>
//                   <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                       />
//                     </svg>
//                     <span>For me</span>
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M19 9l-7 7-7-7"
//                       />
//                     </svg>
//                   </button>
//                 </div>
//               </div>

//               <button
//                 onClick={handleSearch}
//                 className="w-full bg-gray-200 text-gray-800 font-medium py-3 rounded-lg hover:bg-gray-300 transition duration-200 mt-6"
//               >
//                 Search
//               </button>

//               <div className="text-black font-medium bg-white px-6 py-3">
//                 Distance: {distance} km
//               </div>
//               <div className="text-black font-medium bg-white px-6 py-3">
//                 Price: ₹ {(distance * 10).toFixed(2)} (₹10 per km)
//               </div>
//                 {/* Activity Button */}
//               <div className="p-6 border-t border-gray-200">
//                 <button className="flex items-center space-x-2 text-gray-700 hover:text-black">
//                   <svg
//                     className="w-5 h-5"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
//                     />
//                   </svg>
//                   <span className="font-medium">Activity</span>
//                 </button>
//               </div>
//               {/* Search History */}
//               {searchHistory.length > 0 && (
//                 <div className="mt-6 mx-6 space-y-3">
//                   <h3 className="text-sm font-medium text-gray-900">
//                     Recent searches
//                   </h3>
//                   <div className="space-y-2 max-h-64 overflow-y-auto">
//                     {searchHistory.map((search, index) => (
//                       <div
//                         key={index}
//                         onClick={() => handleHistoryClick(search)}
//                         className="p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
//                       >
//                         <div className="flex items-center space-x-2 text-sm">
//                           <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
//                           <span className="text-gray-700 flex-1">
//                             {search.from}
//                           </span>
//                         </div>
//                         <div className="flex items-center space-x-2 text-sm mt-1">
//                           <div className="w-2 h-2 bg-black rounded-sm"></div>
//                           <span className="text-gray-700 flex-1">
//                             {search.to}
//                           </span>
//                         </div>
//                         <div className="text-xs text-gray-500 mt-1">
//                           {search.timestamp}
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Clear history button */}
//                   <button
//                     onClick={() => setSearchHistory([])}
//                     className="w-full text-sm text-gray-500 hover:text-gray-700 py-2"
//                   >
//                     Clear history
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Map Area */}
//       <div className="flex-1 relative">
//         <RoutingMap
//           from={coords.from}
//           to={coords.to}
//           fromname={from}
//           toname={to}
//           handleDistanceUpdate={handleDistanceUpdate}
//         />
//       </div>
//     </div>
//   );
// }
// app/profile/ProfileClient.js (Complete Fixed Version)
// "use client";
// import { useState, useEffect } from "react";
// import dynamic from "next/dynamic";
// import { updateProfile, updatePassword, logout } from "./action";
// import { createClient } from "@/utils/supabase/client";

// const RoutingMap = dynamic(() => import("./RoutingMap"), { ssr: false });

// export default function ProfileClient({ user, profile, searchParams }) {
//   const [from, setFrom] = useState("");
//   const [to, setTo] = useState("");
//   const [coords, setCoords] = useState({ from: null, to: null });
//   const [activeTab, setActiveTab] = useState("profile");
//   const [searchHistory, setSearchHistory] = useState([]);
//   const [distance, setDistance] = useState(null);
//   const [currentRideRequest, setCurrentRideRequest] = useState(null);
//   const [rideStatus, setRideStatus] = useState(null);
//   const [assignedDriver, setAssignedDriver] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [rideHistory, setRideHistory] = useState([]);

//   const supabase = createClient();

//   // Load existing ride request on component mount
//   useEffect(() => {
//     loadCurrentRideRequest();
//     loadRideHistory();
//   }, [user]);

//   async function loadCurrentRideRequest() {
//     try {
//       // Check for active ride request
//       const { data: rideRequests, error } = await supabase
//         .from("ride_requests")
//         .select("*")
//         .eq("user_id", user.id)
//         .in("status", [
//           "pending",
//           "accepted",
//           "en_route",
//           "arrived",
//           "picked_up",
//         ])
//         .order("created_at", { ascending: false })
//         .limit(1);

//       if (error) throw error;

//       if (rideRequests && rideRequests.length > 0) {
//         const activeRide = rideRequests[0];
//         setCurrentRideRequest(activeRide);
//         setRideStatus(activeRide.status);

//         // Set the locations and coordinates from the active ride
//         setFrom(activeRide.pickup_location);
//         setTo(activeRide.dropoff_location);
//         setCoords({
//           from: [activeRide.pickup_lat, activeRide.pickup_lng],
//           to: [activeRide.dropoff_lat, activeRide.dropoff_lng],
//         });
//         setDistance(activeRide.distance);

//         // If ride is accepted by driver, fetch driver details
//         if (
//           (activeRide.status === "accepted" ||
//             activeRide.status === "en_route" ||
//             activeRide.status === "arrived" ||
//             activeRide.status === "picked_up") &&
//           activeRide.driver_id
//         ) {
//           await fetchDriverDetails(activeRide.driver_id);
//         }
//       }
//     } catch (error) {
//       console.error("Error loading current ride request:", error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function loadRideHistory() {
//     try {
//       const { data: historyData, error } = await supabase
//         .from("ride_requests")
//         .select("*")
//         .eq("user_id", user.id)
//         .in("status", ["completed", "cancelled"])
//         .order("created_at", { ascending: false })
//         .limit(10);

//       if (error) throw error;

//       if (historyData) {
//         setRideHistory(historyData);
//       }
//     } catch (error) {
//       console.error("Error loading ride history:", error);
//     }
//   }

//   async function fetchDriverDetails(driverId) {
//     try {
//       const { data: driverData, error } = await supabase
//         .from("driver_profiles")
//         .select("*")
//         .eq("id", driverId)
//         .single();

//       if (error) throw error;

//       if (driverData) {
//         setAssignedDriver(driverData);
//       }
//     } catch (error) {
//       console.error("Error fetching driver details:", error);
//     }
//   }

//   // Subscribe to ride request updates
//   useEffect(() => {
//     if (!currentRideRequest) return;

//     const channel = supabase
//       .channel(`ride_request_${currentRideRequest.id}`)
//       .on(
//         "postgres_changes",
//         {
//           event: "UPDATE",
//           schema: "public",
//           table: "ride_requests",
//           filter: `id=eq.${currentRideRequest.id}`,
//         },
//         async (payload) => {
//           console.log("Ride status updated:", payload.new);
//           setRideStatus(payload.new.status);

//           // Update current ride request with new data
//           setCurrentRideRequest((prev) => ({ ...prev, ...payload.new }));

//           if (
//             (payload.new.status === "accepted" ||
//               payload.new.status === "en_route" ||
//               payload.new.status === "arrived" ||
//               payload.new.status === "picked_up") &&
//             payload.new.driver_id
//           ) {
//             await fetchDriverDetails(payload.new.driver_id);
//           }

//           // Clear ride data if completed or cancelled
//           if (
//             payload.new.status === "completed" ||
//             payload.new.status === "cancelled"
//           ) {
//             // Add to history
//             loadRideHistory();

//             setTimeout(() => {
//               setCurrentRideRequest(null);
//               setRideStatus(null);
//               setAssignedDriver(null);
//               // Don't clear the form fields - let user see the completed ride info
//             }, 3000); // Clear after 3 seconds
//           }
//         }
//       )
//       .subscribe();

//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [currentRideRequest]);

//   function handleDistanceUpdate(newDistance) {
//     setDistance(newDistance);
//   }

//   async function geocodePlace(place) {
//     const res = await fetch(
//       `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
//         place
//       )}`
//     );
//     const data = await res.json();
//     if (data.length > 0)
//       return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
//     return null;
//   }

//   async function handleSearch() {
//     const fromCoords = await geocodePlace(from);
//     const toCoords = await geocodePlace(to);
//     if (fromCoords && toCoords) {
//       setCoords({ from: fromCoords, to: toCoords });

//       // Add to search history (avoid duplicates)
//       const newSearch = { from, to, timestamp: new Date().toLocaleString() };
//       setSearchHistory((prev) => {
//         const exists = prev.some(
//           (search) => search.from === from && search.to === to
//         );
//         if (!exists) {
//           return [newSearch, ...prev.slice(0, 9)];
//         }
//         return prev;
//       });
//     } else {
//       alert("One of the locations could not be found.");
//     }
//   }

//   async function requestRide() {
//     if (!distance || !from || !to || !coords.from || !coords.to) {
//       alert("Please search for a route first");
//       return;
//     }

//     const price = (distance * 10).toFixed(2);

//     try {
//       const { data, error } = await supabase
//         .from("ride_requests")
//         .insert([
//           {
//             user_id: user.id,
//             user_name: profile?.username || user.email.split("@")[0],
//             user_phone: profile?.phone || "Not provided",
//             pickup_location: from,
//             dropoff_location: to,
//             pickup_lat: coords.from[0],
//             pickup_lng: coords.from[1],
//             dropoff_lat: coords.to[0],
//             dropoff_lng: coords.to[1],
//             distance: parseFloat(distance),
//             price: parseFloat(price),
//             status: "pending",
//             created_at: new Date().toISOString(),
//           },
//         ])
//         .select()
//         .single();

//       if (error) throw error;

//       setCurrentRideRequest(data);
//       setRideStatus("pending");
//       alert("Ride request sent! Waiting for a driver to accept.");
//     } catch (error) {
//       console.error("Error requesting ride:", error);
//       alert("Failed to request ride. Please try again.");
//     }
//   }

//   async function cancelRide() {
//     if (!currentRideRequest) return;

//     try {
//       const { error } = await supabase
//         .from("ride_requests")
//         .update({
//           status: "cancelled",
//           cancelled_at: new Date().toISOString(),
//         })
//         .eq("id", currentRideRequest.id);

//       if (error) throw error;

//       setCurrentRideRequest(null);
//       setRideStatus(null);
//       setAssignedDriver(null);
//       alert("Ride cancelled successfully");
//       loadRideHistory();
//     } catch (error) {
//       console.error("Error cancelling ride:", error);
//       alert("Failed to cancel ride");
//     }
//   }

//   function handleHistoryClick(historyItem) {
//     // Don't allow history clicks if there's an active ride
//     if (rideStatus && !["completed", "cancelled"].includes(rideStatus)) {
//       return;
//     }

//     setFrom(historyItem.from);
//     setTo(historyItem.to);
//     setCoords({ from: null, to: null });

//     setTimeout(async () => {
//       const fromCoords = await geocodePlace(historyItem.from);
//       const toCoords = await geocodePlace(historyItem.to);
//       if (fromCoords && toCoords) {
//         setTimeout(() => {
//           setCoords({ from: fromCoords, to: toCoords });
//         }, 100);
//       }
//     }, 100);
//   }

//   const error = searchParams?.error;
//   const message = searchParams?.message;

//   const getRideStatusColor = (status) => {
//     switch (status) {
//       case "pending":
//         return "text-yellow-600 bg-yellow-50 border-yellow-200";
//       case "accepted":
//         return "text-green-600 bg-green-50 border-green-200";
//       case "en_route":
//         return "text-blue-600 bg-blue-50 border-blue-200";
//       case "arrived":
//         return "text-purple-600 bg-purple-50 border-purple-200";
//       case "picked_up":
//         return "text-indigo-600 bg-indigo-50 border-indigo-200";
//       case "completed":
//         return "text-gray-600 bg-gray-50 border-gray-200";
//       case "cancelled":
//         return "text-red-600 bg-red-50 border-red-200";
//       default:
//         return "text-gray-600 bg-gray-50 border-gray-200";
//     }
//   };

//   const getRideStatusText = (status) => {
//     switch (status) {
//       case "pending":
//         return "Looking for driver...";
//       case "accepted":
//         return "Driver accepted! Preparing to pickup";
//       case "en_route":
//         return "Driver is on the way";
//       case "arrived":
//         return "Driver has arrived at pickup";
//       case "picked_up":
//         return "You are in the ride";
//       case "completed":
//         return "Ride completed";
//       case "cancelled":
//         return "Ride cancelled";
//       default:
//         return status;
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "pending":
//         return "🔄";
//       case "accepted":
//         return "✅";
//       case "en_route":
//         return "🚗";
//       case "arrived":
//         return "📍";
//       case "picked_up":
//         return "🛣️";
//       case "completed":
//         return "🎉";
//       case "cancelled":
//         return "❌";
//       default:
//         return "❓";
//     }
//   };

//   // Show loading state while checking for active rides
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-white flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-white flex">
//       {/* Left Sidebar */}
//       <div className="w-96 bg-white shadow-lg flex flex-col">
//         {/* Header */}
//         <div className="p-6 border-b border-gray-200">
//           <div className="flex items-center space-x-3">
//             <div className="w-10 h-10 bg-black rounded flex items-center justify-center">
//               <span className="text-white font-bold text-lg">U</span>
//             </div>
//             <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
//           </div>
//         </div>

//         {/* Tab Navigation */}
//         <div className="flex border-b border-gray-200">
//           <button
//             onClick={() => setActiveTab("profile")}
//             className={`flex-1 px-6 py-4 text-sm font-medium ${
//               activeTab === "profile"
//                 ? "text-black border-b-2 border-black"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             Profile
//           </button>
//           <button
//             onClick={() => setActiveTab("trip")}
//             className={`flex-1 px-6 py-4 text-sm font-medium ${
//               activeTab === "trip"
//                 ? "text-black border-b-2 border-black"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             Find a trip
//           </button>
//           <button
//             onClick={() => setActiveTab("history")}
//             className={`flex-1 px-6 py-4 text-sm font-medium ${
//               activeTab === "history"
//                 ? "text-black border-b-2 border-black"
//                 : "text-gray-500 hover:text-gray-700"
//             }`}
//           >
//             History
//           </button>
//         </div>

//         {/* Content Area */}
//         <div className="flex-1 overflow-y-auto">
//           {activeTab === "profile" && (
//             <div className="p-6 space-y-6">
//               {/* Messages */}
//               {error && (
//                 <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
//                   {error}
//                 </div>
//               )}
//               {message && (
//                 <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
//                   {message}
//                 </div>
//               )}

//               {/* Profile Info */}
//               <div className="space-y-4">
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
//                     Email
//                   </p>
//                   <p className="text-lg text-gray-900">{user.email}</p>
//                 </div>

//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
//                     Username
//                   </p>
//                   <p className="text-lg text-gray-900">
//                     {profile?.username || "Not set"}
//                   </p>
//                 </div>

//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
//                     Phone
//                   </p>
//                   <p className="text-lg text-gray-900">
//                     {profile?.phone || "Not set"}
//                   </p>
//                 </div>
//               </div>

//               {/* Update Profile Form */}
//               <div className="space-y-4">
//                 <h2 className="text-lg font-semibold text-gray-900">
//                   Update Profile
//                 </h2>
//                 <form action={updateProfile} className="space-y-4">
//                   <input
//                     name="username"
//                     placeholder={`Current: ${profile?.username || "Not set"}`}
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent outline-none"
//                   />
//                   <input
//                     name="phone"
//                     placeholder={`Current: ${profile?.phone || "Not set"}`}
//                     type="tel"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent outline-none"
//                   />
//                   <button
//                     type="submit"
//                     className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition duration-200"
//                   >
//                     Update Profile
//                   </button>
//                 </form>
//               </div>

//               {/* Update Password Form */}
//               <div className="space-y-4">
//                 <h2 className="text-lg font-semibold text-gray-900">
//                   Change Password
//                 </h2>
//                 <form action={updatePassword} className="space-y-4">
//                   <input
//                     name="password"
//                     type="password"
//                     placeholder="New Password (min 6 characters)"
//                     minLength="6"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent outline-none"
//                   />
//                   <button
//                     type="submit"
//                     className="w-full bg-gray-900 text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition duration-200"
//                   >
//                     Change Password
//                   </button>
//                 </form>
//               </div>

//               {/* Logout Button */}
//               <form action={logout}>
//                 <button
//                   type="submit"
//                   className="w-full bg-red-600 text-white font-medium py-3 rounded-lg hover:bg-red-500 transition duration-200"
//                 >
//                   Logout
//                 </button>
//               </form>
//             </div>
//           )}

//           {activeTab === "trip" && (
//             <div className="p-6 space-y-4">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">
//                 Find a trip
//               </h2>

//               {/* Current Ride Status */}
//               {rideStatus &&
//                 !["completed", "cancelled"].includes(rideStatus) && (
//                   <div
//                     className={`p-4 rounded-lg border ${getRideStatusColor(
//                       rideStatus
//                     )} mb-6`}
//                   >
//                     <div className="flex justify-between items-start">
//                       <div className="flex-1">
//                         <div className="flex items-center space-x-2 mb-2">
//                           <span className="text-2xl">
//                             {getStatusIcon(rideStatus)}
//                           </span>
//                           <h3 className="font-semibold text-lg">
//                             Current Ride
//                           </h3>
//                         </div>
//                         <p className="text-sm mb-3 font-medium">
//                           {getRideStatusText(rideStatus)}
//                         </p>

//                         <div className="text-sm space-y-1">
//                           <p>
//                             <strong>From:</strong>{" "}
//                             {currentRideRequest?.pickup_location}
//                           </p>
//                           <p>
//                             <strong>To:</strong>{" "}
//                             {currentRideRequest?.dropoff_location}
//                           </p>
//                           <p>
//                             <strong>Distance:</strong>{" "}
//                             {currentRideRequest?.distance} km
//                           </p>
//                           <p>
//                             <strong>Price:</strong> ₹{currentRideRequest?.price}
//                           </p>
//                         </div>

//                         {/* Ride Timeline */}
//                         <div className="mt-3 text-xs text-gray-600 space-y-1">
//                           <p>
//                             • Requested:{" "}
//                             {new Date(
//                               currentRideRequest?.created_at
//                             ).toLocaleTimeString()}
//                           </p>
//                           {currentRideRequest?.accepted_at && (
//                             <p>
//                               • Accepted:{" "}
//                               {new Date(
//                                 currentRideRequest.accepted_at
//                               ).toLocaleTimeString()}
//                             </p>
//                           )}
//                           {currentRideRequest?.en_route_at && (
//                             <p>
//                               • En Route:{" "}
//                               {new Date(
//                                 currentRideRequest.en_route_at
//                               ).toLocaleTimeString()}
//                             </p>
//                           )}
//                           {currentRideRequest?.arrived_at && (
//                             <p>
//                               • Arrived:{" "}
//                               {new Date(
//                                 currentRideRequest.arrived_at
//                               ).toLocaleTimeString()}
//                             </p>
//                           )}
//                           {currentRideRequest?.picked_up_at && (
//                             <p>
//                               • Picked Up:{" "}
//                               {new Date(
//                                 currentRideRequest.picked_up_at
//                               ).toLocaleTimeString()}
//                             </p>
//                           )}
//                         </div>

//                         {assignedDriver && (
//                           <div className="mt-3 p-3 bg-white rounded border">
//                             <h4 className="font-medium text-gray-900 mb-2">
//                               Your Driver
//                             </h4>
//                             <div className="text-sm text-gray-600 space-y-1">
//                               <p>
//                                 <strong>Name:</strong>{" "}
//                                 {assignedDriver.full_name}
//                               </p>
//                               <p>
//                                 <strong>Phone:</strong> {assignedDriver.phone}
//                               </p>
//                               <p>
//                                 <strong>Vehicle:</strong>{" "}
//                                 {assignedDriver.vehicle_model}
//                               </p>
//                               <p>
//                                 <strong>Plate:</strong>{" "}
//                                 {assignedDriver.vehicle_plate}
//                               </p>
//                               <p>
//                                 <strong>Rating:</strong> {assignedDriver.rating}
//                                 /5.0
//                               </p>
//                             </div>
//                             <div className="mt-2 flex space-x-2">
//                               <a
//                                 href={`tel:${assignedDriver.phone}`}
//                                 className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
//                               >
//                                 Call Driver
//                               </a>
//                               <a
//                                 href={`sms:${assignedDriver.phone}`}
//                                 className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
//                               >
//                                 Message
//                               </a>
//                             </div>
//                           </div>
//                         )}
//                       </div>

//                       {rideStatus === "pending" && (
//                         <button
//                           onClick={cancelRide}
//                           className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 ml-2"
//                         >
//                           Cancel
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 )}

//               <div className="space-y-4">
//                 {/* Pick-up location */}
//                 <div className="relative">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
//                     <input
//                       type="text"
//                       value={from}
//                       onChange={(e) => setFrom(e.target.value)}
//                       placeholder="Pick-up location"
//                       disabled={
//                         rideStatus &&
//                         !["completed", "cancelled"].includes(rideStatus)
//                       }
//                       className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//                     />
//                   </div>
//                 </div>

//                 {/* Drop-off location */}
//                 <div className="relative">
//                   <div className="flex items-center space-x-3">
//                     <div className="w-3 h-3 bg-black rounded-sm"></div>
//                     <input
//                       type="text"
//                       value={to}
//                       onChange={(e) => setTo(e.target.value)}
//                       placeholder="Drop-off location"
//                       disabled={
//                         rideStatus &&
//                         !["completed", "cancelled"].includes(rideStatus)
//                       }
//                       className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
//                     />
//                   </div>
//                 </div>

//                 {/* Time and passenger selectors */}
//                 <div className="flex items-center space-x-3">
//                   <div className="w-3 h-3"></div>
//                   <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//                       />
//                     </svg>
//                     <span>Pick up now</span>
//                   </button>
//                 </div>

//                 <div className="flex items-center space-x-3">
//                   <div className="w-3 h-3"></div>
//                   <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
//                     <svg
//                       className="w-4 h-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                       />
//                     </svg>
//                     <span>For me</span>
//                   </button>
//                 </div>
//               </div>

//               <button
//                 onClick={handleSearch}
//                 disabled={
//                   rideStatus && !["completed", "cancelled"].includes(rideStatus)
//                 }
//                 className="w-full bg-gray-200 text-gray-800 font-medium py-3 rounded-lg hover:bg-gray-300 transition duration-200 mt-6 disabled:bg-gray-100 disabled:cursor-not-allowed"
//               >
//                 Search
//               </button>

//               {distance && (
//                 <>
//                   <div className="text-black font-medium bg-white px-6 py-3 border rounded">
//                     Distance: {distance} km
//                   </div>
//                   <div className="text-black font-medium bg-white px-6 py-3 border rounded">
//                     Price: ₹ {(distance * 10).toFixed(2)} (₹10 per km)
//                   </div>

//                   {(!rideStatus ||
//                     ["completed", "cancelled"].includes(rideStatus)) && (
//                     <button
//                       onClick={requestRide}
//                       className="w-full bg-green-600 text-white font-medium py-3 rounded-lg hover:bg-green-700 transition duration-200 mt-4"
//                     >
//                       Request Ride
//                     </button>
//                   )}
//                 </>
//               )}

//               {/* Search History */}
//               {searchHistory.length > 0 && (
//                 <div className="mt-6 space-y-3">
//                   <h3 className="text-sm font-medium text-gray-900">
//                     Recent searches
//                   </h3>
//                   <div className="space-y-2 max-h-64 overflow-y-auto">
//                     {searchHistory.map((search, index) => (
//                       <div
//                         key={index}
//                         onClick={() => handleHistoryClick(search)}
//                         className={`p-3 bg-gray-50 rounded-lg transition-colors ${
//                           rideStatus &&
//                           !["completed", "cancelled"].includes(rideStatus)
//                             ? "cursor-not-allowed opacity-50"
//                             : "cursor-pointer hover:bg-gray-100"
//                         }`}
//                       >
//                         <div className="flex items-center space-x-2 text-sm">
//                           <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
//                           <span className="text-gray-700 flex-1">
//                             {search.from}
//                           </span>
//                         </div>
//                         <div className="flex items-center space-x-2 text-sm mt-1">
//                           <div className="w-2 h-2 bg-black rounded-sm"></div>
//                           <span className="text-gray-700 flex-1">
//                             {search.to}
//                           </span>
//                         </div>
//                         <div className="text-xs text-gray-500 mt-1">
//                           {search.timestamp}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   <button
//                     onClick={() => setSearchHistory([])}
//                     className="w-full text-sm text-gray-500 hover:text-gray-700 py-2"
//                   >
//                     Clear history
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}

//           {activeTab === "history" && (
//             <div className="p-6 space-y-4">
//               <h2 className="text-lg font-semibold text-gray-900 mb-4">
//                 Ride History
//               </h2>

//               {rideHistory.length === 0 ? (
//                 <div className="text-center py-8">
//                   <p className="text-gray-500">No ride history yet</p>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {rideHistory.map((ride) => (
//                     <div key={ride.id} className="bg-gray-50 p-4 rounded-lg">
//                       <div className="flex justify-between items-start mb-2">
//                         <div className="flex items-center space-x-2">
//                           <span>{getStatusIcon(ride.status)}</span>
//                           <span
//                             className={`text-sm font-medium ${
//                               ride.status === "completed"
//                                 ? "text-green-600"
//                                 : "text-red-600"
//                             }`}
//                           >
//                             {ride.status.charAt(0).toUpperCase() +
//                               ride.status.slice(1)}
//                           </span>
//                         </div>
//                         <span className="text-xs text-gray-500">
//                           {new Date(ride.created_at).toLocaleDateString()}
//                         </span>
//                       </div>

//                       <div className="space-y-1 text-sm">
//                         <p>
//                           <strong>From:</strong> {ride.pickup_location}
//                         </p>
//                         <p>
//                           <strong>To:</strong> {ride.dropoff_location}
//                         </p>
//                         <p>
//                           <strong>Distance:</strong> {ride.distance} km
//                         </p>
//                         <p>
//                           <strong>Price:</strong> ₹{ride.price}
//                         </p>
//                       </div>

//                       {ride.status === "completed" && (
//                         <button
//                           onClick={() => {
//                             setFrom(ride.pickup_location);
//                             setTo(ride.dropoff_location);
//                             setCoords({
//                               from: [ride.pickup_lat, ride.pickup_lng],
//                               to: [ride.dropoff_lat, ride.dropoff_lng],
//                             });
//                             setDistance(ride.distance);
//                             setActiveTab("trip");
//                           }}
//                           className="mt-2 text-xs text-blue-600 hover:text-blue-800"
//                         >
//                           Book Again
//                         </button>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Map Area */}
//       <div className="flex-1 relative">
//         <RoutingMap
//           from={coords.from}
//           to={coords.to}
//           fromname={from}
//           toname={to}
//           handleDistanceUpdate={handleDistanceUpdate}
//         />
//       </div>
//     </div>
//   );
// }

"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { updateProfile, updatePassword, logout } from "./action";
import { createClient } from "@/utils/supabase/client";
import PaymentModal from "../components/PaymentForm";

const RoutingMap = dynamic(() => import("./RoutingMap"), { ssr: false });

export default function ProfileClient({ user, profile, searchParams }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [coords, setCoords] = useState({ from: null, to: null });
  const [activeTab, setActiveTab] = useState("profile");
  const [searchHistory, setSearchHistory] = useState([]);
  const [distance, setDistance] = useState(null);
  const [currentRideRequest, setCurrentRideRequest] = useState(null);
  const [rideStatus, setRideStatus] = useState(null);
  const [assignedDriver, setAssignedDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rideHistory, setRideHistory] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingPaymentRide, setPendingPaymentRide] = useState(null);
  const [userStats, setUserStats] = useState({
    totalRides: 0,
    totalSpent: 0,
    averageRating: 0
  });

  const supabase = createClient();

  // Load existing ride request on component mount
  useEffect(() => {
    loadCurrentRideRequest();
    loadRideHistory();
    loadUserStats();
  }, [user]);

  async function loadCurrentRideRequest() {
    try {
      // Check for active ride request
      const { data: rideRequests, error } = await supabase
        .from("ride_requests")
        .select("*")
        .eq("user_id", user.id)
        .in("status", [
          "pending",
          "accepted",
          "en_route",
          "arrived",
          "picked_up",
        ])
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (rideRequests && rideRequests.length > 0) {
        const activeRide = rideRequests[0];
        setCurrentRideRequest(activeRide);
        setRideStatus(activeRide.status);

        // Set the locations and coordinates from the active ride
        setFrom(activeRide.pickup_location);
        setTo(activeRide.dropoff_location);
        setCoords({
          from: [activeRide.pickup_lat, activeRide.pickup_lng],
          to: [activeRide.dropoff_lat, activeRide.dropoff_lng],
        });
        setDistance(activeRide.distance);

        // If ride is accepted by driver, fetch driver details
        if (
          (activeRide.status === "accepted" ||
            activeRide.status === "en_route" ||
            activeRide.status === "arrived" ||
            activeRide.status === "picked_up") &&
          activeRide.driver_id
        ) {
          await fetchDriverDetails(activeRide.driver_id);
        }
      }
    } catch (error) {
      console.error("Error loading current ride request:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadRideHistory() {
    try {
      const { data: historyData, error } = await supabase
        .from("ride_requests")
        .select("*")
        .eq("user_id", user.id)
        .in("status", ["completed", "cancelled"])
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      if (historyData) {
        setRideHistory(historyData);
      }
    } catch (error) {
      console.error("Error loading ride history:", error);
    }
  }

  async function loadUserStats() {
    try {
      // Get total rides and spending from payment history
      const { data: paymentData, error: paymentError } = await supabase
        .from("payment_history")
        .select("amount, payment_status")
        .eq("user_id", user.id)
        .eq("payment_status", "succeeded");

      if (paymentError) throw paymentError;

      const totalSpent = paymentData ? paymentData.reduce((sum, payment) => sum + parseFloat(payment.amount), 0) : 0;

      // Get total rides count
      const { data: ridesData, error: ridesError } = await supabase
        .from("ride_requests")
        .select("id")
        .eq("user_id", user.id)
        .in("status", ["completed", "cancelled"]);

      if (ridesError) throw ridesError;

      setUserStats({
        totalRides: ridesData ? ridesData.length : 0,
        totalSpent: totalSpent,
        averageRating: 4.8 // Placeholder - you can implement user ratings later
      });

    } catch (error) {
      console.error("Error loading user stats:", error);
    }
  }

  async function fetchDriverDetails(driverId) {
    try {
      const { data: driverData, error } = await supabase
        .from("driver_profiles")
        .select("*")
        .eq("id", driverId)
        .single();

      if (error) throw error;

      if (driverData) {
        setAssignedDriver(driverData);
      }
    } catch (error) {
      console.error("Error fetching driver details:", error);
    }
  }

  // Subscribe to ride request updates
  useEffect(() => {
    if (!currentRideRequest) return;

    const channel = supabase
      .channel(`ride_request_${currentRideRequest.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "ride_requests",
          filter: `id=eq.${currentRideRequest.id}`,
        },
        async (payload) => {
          console.log("Ride status updated:", payload.new);
          setRideStatus(payload.new.status);

          // Update current ride request with new data
          setCurrentRideRequest((prev) => ({ ...prev, ...payload.new }));

          if (
            (payload.new.status === "accepted" ||
              payload.new.status === "en_route" ||
              payload.new.status === "arrived" ||
              payload.new.status === "picked_up") &&
            payload.new.driver_id
          ) {
            await fetchDriverDetails(payload.new.driver_id);
          }

          // Show payment modal if ride is completed and payment is required
          if (payload.new.status === "completed" && payload.new.payment_required && !payload.new.payment_completed) {
            setPendingPaymentRide(payload.new);
            setShowPaymentModal(true);
          }

          // Clear ride data if completed or cancelled
          if (
            payload.new.status === "completed" ||
            payload.new.status === "cancelled"
          ) {
            // Add to history
            loadRideHistory();
            loadUserStats(); // Refresh stats

            setTimeout(() => {
              setCurrentRideRequest(null);
              setRideStatus(null);
              setAssignedDriver(null);
              // Don't clear the form fields - let user see the completed ride info
            }, 3000); // Clear after 3 seconds
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentRideRequest]);

  function handleDistanceUpdate(newDistance) {
    setDistance(newDistance);
  }

  async function geocodePlace(place) {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        place
      )}`
    );
    const data = await res.json();
    if (data.length > 0)
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    return null;
  }

  async function handleSearch() {
    const fromCoords = await geocodePlace(from);
    const toCoords = await geocodePlace(to);
    if (fromCoords && toCoords) {
      setCoords({ from: fromCoords, to: toCoords });

      // Add to search history (avoid duplicates)
      const newSearch = { from, to, timestamp: new Date().toLocaleString() };
      setSearchHistory((prev) => {
        const exists = prev.some(
          (search) => search.from === from && search.to === to
        );
        if (!exists) {
          return [newSearch, ...prev.slice(0, 9)];
        }
        return prev;
      });
    } else {
      alert("One of the locations could not be found.");
    }
  }
 useEffect(() => {
  console.log("Current ride request:", currentRideRequest);
  console.log("Ride status:", rideStatus);
  if (currentRideRequest) {
    console.log("Payment required:", currentRideRequest.payment_required);
    console.log("Payment completed:", currentRideRequest.payment_completed);
  }
}, [currentRideRequest, rideStatus]);

// 2. Add this function to manually trigger payment for any completed ride
const triggerPaymentForRide = (ride) => {
  console.log("Triggering payment for ride:", ride);
  setPendingPaymentRide(ride);
  setShowPaymentModal(true);
};

  async function requestRide() {
    if (!distance || !from || !to || !coords.from || !coords.to) {
      alert("Please search for a route first");
      return;
    }

    const price = (distance * 10).toFixed(2);

    try {
      const { data, error } = await supabase
        .from("ride_requests")
        .insert([
          {
            user_id: user.id,
            user_name: profile?.username || user.email.split("@")[0],
            user_phone: profile?.phone || "Not provided",
            pickup_location: from,
            dropoff_location: to,
            pickup_lat: coords.from[0],
            pickup_lng: coords.from[1],
            dropoff_lat: coords.to[0],
            dropoff_lng: coords.to[1],
            distance: parseFloat(distance),
            price: parseFloat(price),
            status: "pending",
            created_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setCurrentRideRequest(data);
      setRideStatus("pending");
      alert("Ride request sent! Waiting for a driver to accept.");
    } catch (error) {
      console.error("Error requesting ride:", error);
      alert("Failed to request ride. Please try again.");
    }
  }

  async function cancelRide() {
    if (!currentRideRequest) return;

    try {
      const { error } = await supabase
        .from("ride_requests")
        .update({
          status: "cancelled",
          cancelled_at: new Date().toISOString(),
        })
        .eq("id", currentRideRequest.id);

      if (error) throw error;

      setCurrentRideRequest(null);
      setRideStatus(null);
      setAssignedDriver(null);
      alert("Ride cancelled successfully");
      loadRideHistory();
      loadUserStats();
    } catch (error) {
      console.error("Error cancelling ride:", error);
      alert("Failed to cancel ride");
    }
  }

  function handleHistoryClick(historyItem) {
    // Don't allow history clicks if there's an active ride
    if (rideStatus && !["completed", "cancelled"].includes(rideStatus)) {
      return;
    }

    setFrom(historyItem.from);
    setTo(historyItem.to);
    setCoords({ from: null, to: null });

    setTimeout(async () => {
      const fromCoords = await geocodePlace(historyItem.from);
      const toCoords = await geocodePlace(historyItem.to);
      if (fromCoords && toCoords) {
        setTimeout(() => {
          setCoords({ from: fromCoords, to: toCoords });
        }, 100);
      }
    }, 100);
  }

  const handlePaymentSuccess = (paymentIntent) => {
    alert("Payment successful! Thank you for your ride.");
    setPendingPaymentRide(null);
    loadRideHistory();
    loadUserStats();
  };

  const handlePayNowClick = (ride) => {
    setPendingPaymentRide(ride);
    setShowPaymentModal(true);
  };

  const error = searchParams?.error;
  const message = searchParams?.message;

  const getRideStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "accepted":
        return "text-green-600 bg-green-50 border-green-200";
      case "en_route":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "arrived":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "picked_up":
        return "text-indigo-600 bg-indigo-50 border-indigo-200";
      case "completed":
        return "text-gray-600 bg-gray-50 border-gray-200";
      case "cancelled":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getRideStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Looking for driver...";
      case "accepted":
        return "Driver accepted! Preparing to pickup";
      case "en_route":
        return "Driver is on the way";
      case "arrived":
        return "Driver has arrived at pickup";
      case "picked_up":
        return "You are in the ride";
      case "completed":
        return "Ride completed";
      case "cancelled":
        return "Ride cancelled";
      default:
        return status;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "🔄";
      case "accepted":
        return "✅";
      case "en_route":
        return "🚗";
      case "arrived":
        return "📍";
      case "picked_up":
        return "🛣️";
      case "completed":
        return "🎉";
      case "cancelled":
        return "❌";
      default:
        return "❓";
    }
  };

  // Show loading state while checking for active rides
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Payment Modal */}
      <PaymentModal
        rideRequest={pendingPaymentRide}
        isOpen={showPaymentModal}
        onClose={() => {
          setShowPaymentModal(false);
          setPendingPaymentRide(null);
        }}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* Left Sidebar */}
      <div className="w-96 bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-black rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">U</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex-1 px-6 py-4 text-sm font-medium ${
              activeTab === "profile"
                ? "text-black border-b-2 border-black"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("trip")}
            className={`flex-1 px-6 py-4 text-sm font-medium ${
              activeTab === "trip"
                ? "text-black border-b-2 border-black"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Find a trip
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 px-6 py-4 text-sm font-medium ${
              activeTab === "history"
                ? "text-black border-b-2 border-black"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            History
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "profile" && (
            <div className="p-6 space-y-6">
              {/* Messages */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              {message && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  {message}
                </div>
              )}

              {/* User Stats */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Your Stats</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{userStats.totalRides}</div>
                    <div className="text-xs text-gray-500">Total Rides</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">₹{userStats.totalSpent.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">Total Spent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">{userStats.averageRating}</div>
                    <div className="text-xs text-gray-500">Rating</div>
                  </div>
                </div>
              </div>

              {/* Profile Info */}
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Email
                  </p>
                  <p className="text-lg text-gray-900">{user.email}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Username
                  </p>
                  <p className="text-lg text-gray-900">
                    {profile?.username || "Not set"}
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Phone
                  </p>
                  <p className="text-lg text-gray-900">
                    {profile?.phone || "Not set"}
                  </p>
                </div>
              </div>

              {/* Update Profile Form */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Update Profile
                </h2>
                <form action={updateProfile} className="space-y-4">
                  <input
                    name="username"
                    placeholder={`Current: ${profile?.username || "Not set"}`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  />
                  <input
                    name="phone"
                    placeholder={`Current: ${profile?.phone || "Not set"}`}
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition duration-200"
                  >
                    Update Profile
                  </button>
                </form>
              </div>

              {/* Update Password Form */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Change Password
                </h2>
                <form action={updatePassword} className="space-y-4">
                  <input
                    name="password"
                    type="password"
                    placeholder="New Password (min 6 characters)"
                    minLength="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent outline-none"
                  />
                  <button
                    type="submit"
                    className="w-full bg-gray-900 text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition duration-200"
                  >
                    Change Password
                  </button>
                </form>
              </div>

              {/* Logout Button */}
              <form action={logout}>
                <button
                  type="submit"
                  className="w-full bg-red-600 text-white font-medium py-3 rounded-lg hover:bg-red-500 transition duration-200"
                >
                  Logout
                </button>
              </form>
            </div>
          )}

          {activeTab === "trip" && (
            <div className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Find a trip
              </h2>

              {/* Current Ride Status */}
              {rideStatus &&
                !["completed", "cancelled"].includes(rideStatus) && (
                  <div
                    className={`p-4 rounded-lg border ${getRideStatusColor(
                      rideStatus
                    )} mb-6`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-2xl">
                            {getStatusIcon(rideStatus)}
                          </span>
                          <h3 className="font-semibold text-lg">
                            Current Ride
                          </h3>
                        </div>
                        <p className="text-sm mb-3 font-medium">
                          {getRideStatusText(rideStatus)}
                        </p>

                        <div className="text-sm space-y-1">
                          <p>
                            <strong>From:</strong>{" "}
                            {currentRideRequest?.pickup_location}
                          </p>
                          <p>
                            <strong>To:</strong>{" "}
                            {currentRideRequest?.dropoff_location}
                          </p>
                          <p>
                            <strong>Distance:</strong>{" "}
                            {currentRideRequest?.distance} km
                          </p>
                          <p>
                            <strong>Price:</strong> ₹{currentRideRequest?.price}
                          </p>
                        </div>

                        {/* Ride Timeline */}
                        <div className="mt-3 text-xs text-gray-600 space-y-1">
                          <p>
                            • Requested:{" "}
                            {new Date(
                              currentRideRequest?.created_at
                            ).toLocaleTimeString()}
                          </p>
                          {currentRideRequest?.accepted_at && (
                            <p>
                              • Accepted:{" "}
                              {new Date(
                                currentRideRequest.accepted_at
                              ).toLocaleTimeString()}
                            </p>
                          )}
                          {currentRideRequest?.en_route_at && (
                            <p>
                              • En Route:{" "}
                              {new Date(
                                currentRideRequest.en_route_at
                              ).toLocaleTimeString()}
                            </p>
                          )}
                          {currentRideRequest?.arrived_at && (
                            <p>
                              • Arrived:{" "}
                              {new Date(
                                currentRideRequest.arrived_at
                              ).toLocaleTimeString()}
                            </p>
                          )}
                          {currentRideRequest?.picked_up_at && (
                            <p>
                              • Picked Up:{" "}
                              {new Date(
                                currentRideRequest.picked_up_at
                              ).toLocaleTimeString()}
                            </p>
                          )}
                        </div>

                        {assignedDriver && (
                          <div className="mt-3 p-3 bg-white rounded border">
                            <h4 className="font-medium text-gray-900 mb-2">
                              Your Driver
                            </h4>
                            <div className="text-sm text-gray-600 space-y-1">
                              <p>
                                <strong>Name:</strong>{" "}
                                {assignedDriver.full_name}
                              </p>
                              <p>
                                <strong>Phone:</strong> {assignedDriver.phone}
                              </p>
                              <p>
                                <strong>Vehicle:</strong>{" "}
                                {assignedDriver.vehicle_model}
                              </p>
                              <p>
                                <strong>Plate:</strong>{" "}
                                {assignedDriver.vehicle_plate}
                              </p>
                              <p>
                                <strong>Rating:</strong> {assignedDriver.rating}
                                /5.0
                              </p>
                            </div>
                            <div className="mt-2 flex space-x-2">
                              <a
                                href={`tel:${assignedDriver.phone}`}
                                className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                              >
                                Call Driver
                              </a>
                              <a
                                href={`sms:${assignedDriver.phone}`}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                              >
                                Message
                              </a>
                            </div>
                          </div>
                        )}
                      </div>

                      {rideStatus === "pending" && (
                        <button
                          onClick={cancelRide}
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 ml-2"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                )}

              <div className="space-y-4">
                {/* Pick-up location */}
                <div className="relative">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <input
                      type="text"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      placeholder="Pick-up location"
                      disabled={
                        rideStatus &&
                        !["completed", "cancelled"].includes(rideStatus)
                      }
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Drop-off location */}
                <div className="relative">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-black rounded-sm"></div>
                    <input
                      type="text"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      placeholder="Drop-off location"
                      disabled={
                        rideStatus &&
                        !["completed", "cancelled"].includes(rideStatus)
                      }
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-black focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Time and passenger selectors */}
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3"></div>
                  <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Pick up now</span>
                  </button>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3"></div>
                  <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>For me</span>
                  </button>
                </div>
              </div>

              <button
                onClick={handleSearch}
                disabled={
                  rideStatus && !["completed", "cancelled"].includes(rideStatus)
                }
                className="w-full bg-gray-200 text-gray-800 font-medium py-3 rounded-lg hover:bg-gray-300 transition duration-200 mt-6 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                Search
              </button>

              {distance && (
                <>
                  <div className="text-black font-medium bg-white px-6 py-3 border rounded">
                    Distance: {distance} km
                  </div>
                  <div className="text-black font-medium bg-white px-6 py-3 border rounded">
                    Price: ₹ {(distance * 10).toFixed(2)} (₹10 per km)
                  </div>

                  {(!rideStatus ||
                    ["completed", "cancelled"].includes(rideStatus)) && (
                    <button
                      onClick={requestRide}
                      className="w-full bg-green-600 text-white font-medium py-3 rounded-lg hover:bg-green-700 transition duration-200 mt-4"
                    >
                      Request Ride
                    </button>
                  )}
                </>
              )}

              {/* Search History */}
              {searchHistory.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h3 className="text-sm font-medium text-gray-900">
                    Recent searches
                  </h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {searchHistory.map((search, index) => (
                      <div
                        key={index}
                        onClick={() => handleHistoryClick(search)}
                        className={`p-3 bg-gray-50 rounded-lg transition-colors ${
                          rideStatus &&
                          !["completed", "cancelled"].includes(rideStatus)
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                          <span className="text-gray-700 flex-1">
                            {search.from}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm mt-1">
                          <div className="w-2 h-2 bg-black rounded-sm"></div>
                          <span className="text-gray-700 flex-1">
                            {search.to}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {search.timestamp}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setSearchHistory([])}
                    className="w-full text-sm text-gray-500 hover:text-gray-700 py-2"
                  >
                    Clear history
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Ride History
              </h2>

              {rideHistory.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No ride history yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {rideHistory.map((ride) => (
                    <div key={ride.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center space-x-2">
                          <span>{getStatusIcon(ride.status)}</span>
                          <span
                            className={`text-sm font-medium ${
                              ride.status === "completed"
                                ? ride.payment_completed 
                                  ? "text-green-600"
                                  : "text-orange-600"
                                : "text-red-600"
                            }`}
                          >
                            {ride.status.charAt(0).toUpperCase() +
                              ride.status.slice(1)}
                            {ride.status === "completed" && !ride.payment_completed && " (Payment Pending)"}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(ride.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="space-y-1 text-sm">
                        <p>
                          <strong>From:</strong> {ride.pickup_location}
                        </p>
                        <p>
                          <strong>To:</strong> {ride.dropoff_location}
                        </p>
                        <p>
                          <strong>Distance:</strong> {ride.distance} km
                        </p>
                        <p>
                          <strong>Price:</strong> ₹{ride.price}
                        </p>
                        {ride.payment_completed && (
                          <p className="text-green-600 text-xs">
                            <strong>Payment:</strong> Completed
                          </p>
                        )}
                      </div>

                      <div className="mt-3 flex space-x-2">
                        {ride.status === "completed" && (
                          <button
                            onClick={() => {
                              setFrom(ride.pickup_location);
                              setTo(ride.dropoff_location);
                              setCoords({
                                from: [ride.pickup_lat, ride.pickup_lng],
                                to: [ride.dropoff_lat, ride.dropoff_lng],
                              });
                              setDistance(ride.distance);
                              setActiveTab("trip");
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            Book Again
                          </button>
                        )}
                        
                        {ride.status === "completed" && !ride.payment_completed && (
                          <button
                            onClick={() => handlePayNowClick(ride)}
                            className="text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                          >
                            Pay Now
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Map Area */}
      <div className="flex-1 relative">
        <RoutingMap
          from={coords.from}
          to={coords.to}
          fromname={from}
          toname={to}
          handleDistanceUpdate={handleDistanceUpdate}
        />
      </div>
    </div>
  );
}