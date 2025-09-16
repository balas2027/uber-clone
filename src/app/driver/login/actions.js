// app/driver/login/actions.js
"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

// Driver login
export async function driverLogin(formData) {
  const supabase = await createClient();
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    redirect("/driver/login?error=Email and password are required");
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/driver/login?error=${encodeURIComponent(error.message)}`);
  }

  // Check if user is a driver
  const { data: driverProfile } = await supabase
    .from("driver_profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  if (!driverProfile) {
    await supabase.auth.signOut();
    redirect("/driver/login?error=Driver account not found");
  }

  redirect("/driver/dashboard");
}

// Driver signup
export async function driverSignup(formData) {
  const supabase = await createClient();
  const email = formData.get("email");
  const password = formData.get("password");
  const fullName = formData.get("fullName");
  const phone = formData.get("phone");
  const licenseNumber = formData.get("licenseNumber");
  const vehicleModel = formData.get("vehicleModel");
  const vehiclePlate = formData.get("vehiclePlate");

  if (!email || !password || !fullName || !phone || !licenseNumber) {
    redirect("/driver/login?error=All required fields must be filled");
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        user_type: "driver",
      },
    },
  });

  if (error) {
    redirect(`/driver/login?error=${encodeURIComponent(error.message)}`);
  }

  // Create driver profile
  if (data.user) {
    const { error: profileError } = await supabase
      .from("driver_profiles")
      .insert([
        {
          id: data.user.id,
          full_name: fullName,
          email: email,
          phone: phone,
          license_number: licenseNumber,
          vehicle_model: vehicleModel,
          vehicle_plate: vehiclePlate,
          status: "offline",
          is_verified: false,
          rating: 5.0,
          total_rides: 0,
        },
      ]);

    if (profileError) {
      redirect(
        `/driver/login?error=${encodeURIComponent(profileError.message)}`
      );
    }
  }

  redirect("/driver/login?message=Check your email to confirm your account");
}
