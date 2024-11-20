import React from "react";
import BreadCrumb from "Common/BreadCrumb";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

// Konfigurasi untuk Google Map
const containerStyle = {
  width: "100%",
  height: "300px",
};

const center = {
  lat: -6.200000, // Latitude Jakarta
  lng: 106.816666, // Longitude Jakarta
};

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ""; // Ambil dari .env

// Komponen Reusable untuk Card
const MapCard: React.FC<{
  title: string;
  mapId: string;
}> = ({ title, mapId }) => {
  return (
    <div className="card">
      <div className="card-body">
        <h6 className="mb-4 text-gray-800 text-15 dark:text-white">{title}</h6>
        <div id={mapId} className="gmaps" style={{ position: "relative" }}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
          >
            {/* Tambahkan marker, polyline, atau fitur lainnya */}
          </GoogleMap>
        </div>
      </div>
    </div>
  );
};

// Komponen Utama
const MapsGoogle: React.FC = () => {
  return (
    <React.Fragment>
      <div className="container-fluid group-data-[content=boxed]:max-w-boxed mx-auto">
        <BreadCrumb title="Google Maps" pageTitle="Maps" />

        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
          <div className="grid grid-cols-1 gap-x-5 xl:grid-cols-2">
            <MapCard title="Markers" mapId="gmaps-markers" />
            <MapCard title="Overlays" mapId="gmaps-overlays" />
            <MapCard title="Street View Panoramas" mapId="gmaps-street-view" />
            <MapCard title="Map Types" mapId="gmaps-map-types" />
          </div>
        </LoadScript>
      </div>
    </React.Fragment>
  );
};

export default MapsGoogle;
