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
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gray-50 rounded-2xl shadow-2xl border border-gray-200 p-8 space-y-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Driver Portal</h1>
          <p className="text-gray-600">Sign in to start driving</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-3 rounded-lg">
            {message}
          </div>
        )}

        {/* Driver Login */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-900">Sign In</h2>
            <form action={driverLogin} className="space-y-4">
              <input
                name="email"
                type="email"
                placeholder="Driver Email"
                required
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                required
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-500 transition duration-200"
              >
                Sign In as Driver
              </button>
            </form>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-50 px-2 text-gray-600">New driver? Register below</span>
            </div>
          </div>

          {/* Driver Signup */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-center text-gray-900">Register as Driver</h2>
            <form action={driverSignup} className="space-y-4">
              <input
                name="fullName"
                type="text"
                placeholder="Full Name"
                required
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                required
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                required
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <input
                name="phone"
                type="tel"
                placeholder="Phone Number"
                required
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <input
                name="licenseNumber"
                type="text"
                placeholder="Driver's License Number"
                required
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <input
                name="vehicleModel"
                type="text"
                placeholder="Vehicle Model (e.g., Honda City 2022)"
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <input
                name="vehiclePlate"
                type="text"
                placeholder="Vehicle Plate Number"
                className="w-full px-4 py-3 rounded-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <button
                type="submit"
                className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-500 transition duration-200"
              >
                Register as Driver
              </button>
            </form>
          </div>
        </div>

        <div className="text-center">
          <a
            href="/login"
            className="text-gray-600 hover:text-gray-900 transition duration-200"
          >
            Are you a passenger? Sign in here
          </a>
        </div>
      </div>
    </div>
  )
}
