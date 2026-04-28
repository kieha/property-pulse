"use client";

import { useEffect, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import Map, { Marker } from "react-map-gl/mapbox";
import { setDefaults, fromAddress, OutputFormat } from "react-geocode";
import Image from "next/image";
import Spinner from "@/components/Spinner";
import type { Property } from "@/utils/types";
import pin from "@/assets/images/pin.svg";

type PropertyMapProps = {
  property: Property;
};

const PropertyMap = ({ property }: PropertyMapProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [lat, setLat] = useState<number>(0);
  const [lng, setLng] = useState<number>(0);
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 12,
    width: "100%",
    height: "500px",
  });
  const [geocodeError, setGeocodeError] = useState<boolean>(false);

  setDefaults({
    key: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY,
    language: "en",
    region: "us",
    outputFormat: OutputFormat.JSON,
  });

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const res = await fromAddress(
          `${property.location.street} ${property.location.city} ${property.location.state} ${property.location.zipcode} `,
        );

        // check for valid address
        if (!res.results.length) {
          // no results found
          setGeocodeError(true);
          setLoading(false);
          return;
        }

        const { lat, lng } = res.results[0].geometry.location;
        setLat(lat);
        setLng(lng);
        setViewport({
          ...viewport,
          latitude: lat,
          longitude: lng,
        });
        setLoading(false);
      } catch (error) {
        console.log(error);
        setGeocodeError(true);
        setLoading(false);
      }
    };

    fetchCoordinates();
  }, [property.location, viewport]);

  if (loading) return <Spinner />;

  // Handle case where address is not valid or geocoding failed
  if (geocodeError) {
    return <div className="text-xl">No location data found</div>;
  }

  return !loading ? (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      mapLib={import("mapbox-gl")}
      initialViewState={{
        latitude: lat,
        longitude: lng,
        zoom: 15,
      }}
      style={{ width: "100%", height: 500 }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
    >
      <Marker longitude={lng} latitude={lat} anchor="bottom">
        <Image src={pin} alt="location" width={40} height={40} />
      </Marker>
    </Map>
  ) : null;
};

export default PropertyMap;
