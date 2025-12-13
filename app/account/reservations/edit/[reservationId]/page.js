import EditReservationForm from "@/app/_components/EditReservationForm";
import { getBooking, getCabin } from "@/app/_lib/data-service";

export default async function Page({ params }) {
  const { reservationId } = params;
  const { numGuests, observations, cabinId } = await getBooking(reservationId);
  const { maxCapacity } = await getCabin(cabinId);
  // CHANGE

  return (
    <div>
      <h2 className="font-semibold text-2xl text-accent-400 mb-7">
        Edit Reservation #{reservationId}
        <EditReservationForm
          numGuests={numGuests}
          observations={observations}
          maxCapacity={maxCapacity}
          reservationId={reservationId}
        />
      </h2>
    </div>
  );
}
