"use server";
import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import {
  createBooking,
  getBookings,
  updateGuest as updateGuestApi,
} from "./data-service";
import { supabase } from "./supabase";
import { redirect } from "next/navigation";

export async function updateReservation(formData) {
  const session = await auth();

  if (!session) throw new Error("You must logged in ");

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingsIds = guestBookings.map((booking) => booking.id);
  const reservationId = Number(formData.get("reservationId"));

  if (!guestBookingsIds.includes(reservationId))
    throw new Error("you are not allowed to delete this booking");

  const numGuests = formData.get("numGuests");
  const observations = formData.get("observations");

  const updatedFields = {
    numGuests,
    observations,
  };
  const { error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", reservationId)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }

  revalidatePath(`account/reservations/edit/${reservationId}`);
  redirect("/account/reservations");
}

export async function createReservation(bookingData, formData) {
  const session = await auth();

  if (!session) throw new Error("You must logged in ");

  const newBookingData = {
    ...bookingData,
    guestId: session.user.guestId,
    observations: formData.get("observations"),
    numGuests: Number(formData.get("numGuests")),
    extraPrice: 0,
    totalPrice: bookingData.cabinPrice,
    hasBreakfast: false,
    isPaid: false,
    statues: "unconfirmed",
  };

  await createBooking(newBookingData);

  revalidatePath(`/cabins/${bookingData.cabinid}`);

  redirect("/thankyou");
}
export async function deleteReservation(bookingId) {
  const session = await auth();

  if (!session) throw new Error("You must logged in ");

  const guestBookings = await getBookings(session.user.guestId);
  const guestBookingsIds = guestBookings.map((booking) => booking.id);

  if (!guestBookingsIds.includes(bookingId))
    throw new Error("you are not allowed to delete this booking");

  const { error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }

  revalidatePath("account/reservations");
}

export async function updateGuest(formData) {
  const session = await auth();

  if (!session) throw new Error("You must logged in ");

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  if (!/^[a-zA-Z0-9]/.test(nationalID))
    throw new Error("please provide a valid national ID");

  const updateFiled = {
    nationality,
    countryFlag,
    nationalID,
  };
  const guest = await updateGuestApi(session.user.guestId, updateFiled);

  revalidatePath("account/profile");

  return guest;
}

export async function signInUser() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutUser() {
  await signOut({ redirectTo: "/" });
}
