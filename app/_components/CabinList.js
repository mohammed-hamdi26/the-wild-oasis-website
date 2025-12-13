import { unstable_noStore as noStore } from "next/cache";

import CabinCard from "@/app/_components/CabinCard";
import { getCabins } from "../_lib/data-service";

async function CabinList({ filter }) {
  noStore();
  const cabins = await getCabins();

  if (cabins.length === 0) return null;

  let selectedCabins;
  if (filter === "all") selectedCabins = cabins;
  if (filter === "small")
    selectedCabins = cabins.filter((cabin) => cabin.maxCapacity <= 3);
  if (filter === "medium")
    selectedCabins = cabins.filter(
      (cabin) => cabin.maxCapacity > 3 && cabin.maxCapacity < 8
    );
  if (filter === "large")
    selectedCabins = cabins.filter((cabin) => cabin.maxCapacity >= 8);
  return (
    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 xl:gap-14">
      {selectedCabins.map((cabin) => (
        <CabinCard cabin={cabin} key={cabin.id} />
      ))}
    </div>
  );
}

export default CabinList;
