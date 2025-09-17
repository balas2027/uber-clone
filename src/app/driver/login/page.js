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


import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { login, signup, loginWithGoogle } from './actions'

export default async function LoginPage({ searchParams }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/profile')
  }

  const error = searchParams?.error
  const message = searchParams?.message

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {error && (
          <div className="bg-white text-black px-4 py-3 rounded mb-6 text-center font-medium">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-white text-black px-4 py-3 rounded mb-6 text-center font-medium">
            {message}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Toggle Tabs */}
          <div className="flex bg-gray-100 relative">
            <input type="radio" id="login-tab" name="auth-tab" className="hidden peer/login" defaultChecked />
            <input type="radio" id="register-tab" name="auth-tab" className="hidden peer/register" />
            
            <label 
              htmlFor="login-tab" 
              className="flex-1 py-4 text-center font-semibold cursor-pointer transition-colors duration-300 peer-checked/login:text-black text-gray-600 relative z-10"
            >
              Sign In
            </label>
            
            <label 
              htmlFor="register-tab" 
              className="flex-1 py-4 text-center font-semibold cursor-pointer transition-colors duration-300 peer-checked/register:text-black text-gray-600 relative z-10"
            >
              Sign Up
            </label>
            
            {/* Sliding indicator */}
            <div className="absolute top-0 left-0 w-1/2 h-full bg-white transition-transform duration-300 peer-checked/register:translate-x-full"></div>
          </div>

          <div className="p-8 text-black">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Welcome</h1>
              <p className="text-gray-600">Access your account</p>
            </div>

            {/* Login Form */}
            <div className="peer-checked/register:hidden">
              <form action={login} className="space-y-6">
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  className="w-full px-4 py-3 border-2 border-black rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  className="w-full px-4 py-3 border-2 border-black rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
                />
                <button
                  type="submit"
                  className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                >
                  Sign In
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-3 text-gray-600">Or continue with</span>
                </div>
              </div>

              <form action={loginWithGoogle}>
                <button
                  type="submit"
                  className="w-full border-2 border-black text-black font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </form>
            </div>

            {/* Register Form */}
            <div className="peer-checked/login:hidden">
              <form action={signup} className="space-y-6">
                <input
                  name="username"
                  type="text"
                  placeholder="Username (optional)"
                  className="w-full px-4 py-3 border-2 border-black rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  required
                  className="w-full px-4 py-3 border-2 border-black rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  required
                  className="w-full px-4 py-3 border-2 border-black rounded-lg text-black placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors"
                />
                <button
                  type="submit"
                  className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                >
                  Create Account
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-3 text-gray-600">Or continue with</span>
                </div>
              </div>

              <form action={loginWithGoogle}>
                <button
                  type="submit"
                  className="w-full border-2 border-black text-black font-semibold py-3 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
