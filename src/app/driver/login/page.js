// // app/driver/login/page.js
// import { createClient } from '@/utils/supabase/server'
// import { redirect } from 'next/navigation'
// // app/driver/login/page.js
// import { driverLogin, driverSignup } from './actions'



// export default async function DriverLoginPage({ searchParams }) {
//   const supabase = await createClient()
//   const { data: { user } } = await supabase.auth.getUser()

//   // If already logged in, check if driver and redirect accordingly
//   if (user) {
//     const { data: driverProfile } = await supabase
//       .from('driver_profiles')
//       .select('*')
//       .eq('id', user.id)
//       .single()

//     if (driverProfile) {
//       redirect('/driver/dashboard')
//     }
//   }

//   const error = searchParams?.error
//   const message = searchParams?.message

//   return (
//     <div className="min-h-screen bg-black flex items-center justify-center px-4">
//       <div className="w-full max-w-md bg-gray-300 drop-blur-sm rounded-2xl shadow-2xl p-8 space-y-6">
//         <div className="text-center">
//           <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
//             </svg>
//           </div>
//           <h1 className="text-3xl font-bold mb-2">Driver Portal</h1>
//           <p className="text-gray-400">Sign in to start driving</p>
//         </div>

//         {error && (
//           <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
//             {error}
//           </div>
//         )}

//         {message && (
//           <div className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded-lg">
//             {message}
//           </div>
//         )}

//         {/* Driver Login */}
//         <div className="space-y-6">
//           <div>
//             <h2 className="text-xl font-semibold mb-4 text-center">Sign In</h2>
//             <form action={driverLogin} className="space-y-4">
//               <input
//                 name="email"
//                 type="email"
//                 placeholder="Driver Email"
//                 required
//                 className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
//               />
//               <input
//                 name="password"
//                 type="password"
//                 placeholder="Password"
//                 required
//                 className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
//               />
//               <button
//                 type="submit"
//                 className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-500 transition duration-200"
//               >
//                 Sign In as Driver
//               </button>
//             </form>
//           </div>

//           <div className="relative">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-700"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="bg-gray-900 px-2 text-gray-400">New driver? Register below</span>
//             </div>
//           </div>

//           {/* Driver Signup */}
//           <div>
//             <h2 className="text-xl font-semibold mb-4 text-center">Register as Driver</h2>
//             <form action={driverSignup} className="space-y-4">
//               <input
//                 name="fullName"
//                 type="text"
//                 placeholder="Full Name"
//                 required
//                 className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
//               />
//               <input
//                 name="email"
//                 type="email"
//                 placeholder="Email"
//                 required
//                 className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
//               />
//               <input
//                 name="password"
//                 type="password"
//                 placeholder="Password"
//                 required
//                 className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
//               />
//               <input
//                 name="phone"
//                 type="tel"
//                 placeholder="Phone Number"
//                 required
//                 className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
//               />
//               <input
//                 name="licenseNumber"
//                 type="text"
//                 placeholder="Driver's License Number"
//                 required
//                 className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
//               />
//               <input
//                 name="vehicleModel"
//                 type="text"
//                 placeholder="Vehicle Model (e.g., Honda City 2022)"
//                 className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
//               />
//               <input
//                 name="vehiclePlate"
//                 type="text"
//                 placeholder="Vehicle Plate Number"
//                 className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
//               />
//               <button
//                 type="submit"
//                 className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-500 transition duration-200"
//               >
//                 Register as Driver
//               </button>
//             </form>
//           </div>
//         </div>

//         <div className="text-center">
//           <a
//             href="/login"
//             className="text-gray-400 hover:text-white transition duration-200"
//           >
//             Are you a passenger? Sign in here
//           </a>
//         </div>
//       </div>
//     </div>
//   )
// }

// app/driver/login/page.js
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
// app/driver/login/page.js
import { driverLogin, driverSignup } from './actions'



export default async function DriverLoginPage({ searchParams }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If already logged in, check if driver and redirect accordingly
  if (user) {
    const { data: driverProfile } = await supabase
      .from('driver_profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (driverProfile) {
      redirect('/driver/dashboard')
    }
  }

  const error = searchParams?.error
  const message = searchParams?.message

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        {/* Error/Message Alerts */}
        {error && (
          <div className="bg-white text-black px-4 py-3 rounded-lg mb-6 text-center font-semibold animate-slide-down shadow-lg">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-white text-black px-4 py-3 rounded-lg mb-6 text-center font-semibold animate-slide-down shadow-lg">
            {message}
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 hover:scale-105">
          {/* Header with Icon */}
          <div className="bg-black text-white p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer"></div>
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 transform transition-transform duration-300 hover:rotate-12">
              <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-2 animate-pulse-text">Driver Portal</h1>
            <p className="text-gray-300">Sign in to start driving</p>
          </div>

          {/* Toggle Tabs */}
          <div className="flex bg-gray-100 relative">
            <input type="radio" id="driver-login-tab" name="driver-auth-tab" className="hidden peer/login" defaultChecked />
            <input type="radio" id="driver-register-tab" name="driver-auth-tab" className="hidden peer/register" />
            
            <label 
              htmlFor="driver-login-tab" 
              className="flex-1 py-4 text-center font-bold cursor-pointer transition-all duration-300 peer-checked/login:text-black text-gray-600 relative z-10 hover:scale-105"
            >
              Sign In
            </label>
            
            <label 
              htmlFor="driver-register-tab" 
              className="flex-1 py-4 text-center font-bold cursor-pointer transition-all duration-300 peer-checked/register:text-black text-gray-600 relative z-10 hover:scale-105"
            >
              Register
            </label>
            
            {/* Sliding indicator with glow effect */}
            <div className="absolute top-0 left-0 w-1/2 h-full bg-black transition-transform duration-500 ease-out peer-checked/register:translate-x-full shadow-lg"></div>
          </div>

          <div className="p-8 text-black">
            {/* Login Form */}
            <div className="peer-checked/register:hidden animate-fade-in">
              <form action={driverLogin} className="space-y-6">
                <div className="space-y-4">
                  <input
                    name="email"
                    type="email"
                    placeholder="Driver Email"
                    required
                    className="w-full px-6 py-4 border-2 border-black rounded-xl text-black placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                  />
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    className="w-full px-6 py-4 border-2 border-black rounded-xl text-black placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95"
                >
                  Sign In as Driver
                </button>
              </form>
            </div>

            {/* Register Form */}
            <div className="peer-checked/login:hidden animate-fade-in">
              <form action={driverSignup} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <input
                    name="fullName"
                    type="text"
                    placeholder="Full Name"
                    required
                    className="w-full px-6 py-3 border-2 border-black rounded-xl text-black placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    className="w-full px-6 py-3 border-2 border-black rounded-xl text-black placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                  />
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    className="w-full px-6 py-3 border-2 border-black rounded-xl text-black placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                  />
                  <input
                    name="phone"
                    type="tel"
                    placeholder="Phone Number"
                    required
                    className="w-full px-6 py-3 border-2 border-black rounded-xl text-black placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                  />
                  <input
                    name="licenseNumber"
                    type="text"
                    placeholder="Driver's License Number"
                    required
                    className="w-full px-6 py-3 border-2 border-black rounded-xl text-black placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                  />
                  <input
                    name="vehicleModel"
                    type="text"
                    placeholder="Vehicle Model (e.g., Honda City 2022)"
                    className="w-full px-6 py-3 border-2 border-black rounded-xl text-black placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                  />
                  <input
                    name="vehiclePlate"
                    type="text"
                    placeholder="Vehicle Plate Number"
                    className="w-full px-6 py-3 border-2 border-black rounded-xl text-black placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 mt-6"
                >
                  Register as Driver
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Link */}
          <div className="bg-gray-50 p-6 text-center border-t">
            <a
              href="/login"
              className="text-black font-semibold hover:text-gray-600 transition-all duration-300 transform hover:scale-105 inline-block"
            >
              Are you a passenger? Sign in here →
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes pulse-text {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.4s ease-out;
        }

        .animate-shimmer {
          animation: shimmer 3s infinite;
        }

        .animate-pulse-text {
          animation: pulse-text 2s infinite;
        }
      `}</style>
    </div>
  )
}
