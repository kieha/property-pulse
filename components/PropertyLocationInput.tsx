"use client";

import { useCallback, useEffect, useRef } from "react";
import { useLoadScript } from "@react-google-maps/api";
import { LIBRARIES } from "@/utils/constants";

type PropertyLocationInputProps = {
  value: string | undefined;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  setLocationFields: (address: {
    street: string;
    city: string;
    state: string;
    zipcode: string;
  }) => void;
};

const PropertyLocationInput = ({
  value,
  onChange,
  setLocationFields,
}: PropertyLocationInputProps) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: LIBRARIES,
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const locationData = useCallback(
    (data: google.maps.places.PlaceResult) => {
      const addressComponents = data.address_components;
      if (!addressComponents) return;

      const componentMap = {
        street_number: "",
        route: "",
        locality: "",
        administrative_area_level_1: "",
        postal_code: "",
      };

      for (const component of addressComponents) {
        const componentType = component.types[0];
        if (componentMap.hasOwnProperty(componentType)) {
          componentMap[componentType as keyof typeof componentMap] =
            component.long_name;
        }
      }

      const formattedAddress =
        `${componentMap.street_number} ${componentMap.route}`.trim();

      setLocationFields({
        street: formattedAddress,
        city: componentMap.locality,
        state: componentMap.administrative_area_level_1,
        zipcode: componentMap.postal_code,
      });
    },
    [setLocationFields],
  );

  const handlePlaceChange = useCallback(
    async (address: google.maps.places.Autocomplete) => {
      if (!isLoaded) return;
      const place = address.getPlace();

      if (!place) return;
      locationData(place);
    },
    [isLoaded, locationData],
  );

  useEffect(() => {
    if (!isLoaded || loadError) return;

    const autocompleteOptions = {
      componentRestrictions: { country: "us" },
      fields: ["address_components"],
    };

    const autocomplete = new google.maps.places.Autocomplete(
      inputRef.current as HTMLInputElement,
      autocompleteOptions,
    );
    autocomplete.addListener("place_changed", () =>
      handlePlaceChange(autocomplete),
    );

    // FIX: this is making the behavior of the autocomplete erratic
    // return () => google.maps.event.removeListener(listener);
  }, [isLoaded, loadError, handlePlaceChange]);

  return (
    <input
      type="text"
      id="street"
      name="location.street"
      ref={inputRef}
      className="border rounded w-full py-2 px-3 mb-2"
      placeholder="Street Address"
      value={value}
      onChange={onChange}
    />
  );
};

export default PropertyLocationInput;
