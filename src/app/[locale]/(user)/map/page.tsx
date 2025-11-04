import MapClient from "@/components/map/MapClient";
import MapMobile from "@/components/map/MapMobile";

const MapPage = () => {
  return (
    <>
      <MapMobile />
      <div className="hidden md:block">
        <MapClient />
      </div>
    </>
  );
};

export default MapPage;