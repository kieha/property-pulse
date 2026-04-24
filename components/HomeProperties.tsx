"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Property } from "@/utils/types";
import { fetchProperties } from "@/utils/requests";
import PropertyCard from "@/components/PropertyCard";
import Spinner from "./Spinner";

const HomeProperties = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchPropertiesData = async () => {
      try {
        const propertiesData = await fetchProperties();
        const recentProperties = propertiesData
          .sort(() => 0.5 - Math.random())
          .slice(0, 3);
        setProperties(recentProperties);
      } catch (error) {
        console.error("Error fetching properties", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertiesData();
  }, []);

  return loading ? (
    <Spinner />
  ) : (
    <>
      <section className="px-4 py-6">
        <div className="container-xl lg:container m-auto">
          <h2 className="text-3xl font-bold text-blue-500 mb-6 text-center">
            Recent Properties
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {!properties ? (
              <p>No properties found</p>
            ) : (
              properties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))
            )}
          </div>
        </div>
      </section>

      <section className="m-auto max-w-lg my-10 px-6">
        <Link
          href="/properties"
          className="block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700"
        >
          View All Properties
        </Link>
      </section>
    </>
  );
};

export default HomeProperties;
