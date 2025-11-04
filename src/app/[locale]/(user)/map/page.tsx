import MapClient from "@/components/map/MapClient";
import MapMobile from "@/components/map/MapMobile";

const MapPage = () => {
  return (
    <>
      <div className="block md:hidden">
        <MapMobile />
      </div>
      <div className="hidden md:block">
        <MapClient />
      </div>
    </>
  );
};

export default MapPage;