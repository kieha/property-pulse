import type { Property } from "@/utils/types";

const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

/**
 * Fetch all the properties from the database
 * @returns Property[]
 */
async function fetchProperties() {
  try {    
    // handle case where domain is not available yet
    if (!apiDomain) return [];

    const res = await fetch(`${apiDomain}/properties`, { cache: "no-store" });

    if (!res.ok) {
      throw new Error("Failed to fetch property");
    }

    return await res.json() as Property[];
  } catch (error) {
    console.log(error);
    return [];
  }
};

/**
 * Fetch a single property
 * @param id string
 * @returns Property
 */
async function fetchProperty(id: string) {
  try {
    // handle case where domain is not available yet
    if (!apiDomain) return null;

    const res = await fetch(`${apiDomain}/properties/${id}`);

    if (!res.ok) {
      throw new Error("Failed to fetch property");
    }

    return await res.json() as Property;
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * Fetch properties belonging to a specific user
 * @param userId string
 * @returns Property[]
 */
async function fetchUserProperties(userId: string) {
  try {
    // handle case where domain is not available yet
    if (!apiDomain) return [];

    const res = await fetch(`${apiDomain}/properties/user/${userId}`);

    if (!res.ok) {
      throw new Error("Failed to fetch properties");
    }

    return await res.json() as Property[];
  } catch (error) {
    console.log(error);
    return [];
  }
};

/**
 * Delete a property
 * @param id string
 * @returns true
 */
async function deleteProperty(id: string) {
  try {
    // handle case where domain is not available yet
    if (!apiDomain) return null;

    const res = await fetch(`${apiDomain}/properties/${id}`, { method: "DELETE" });

    if (!res.ok) {
      throw new Error("Failed to delete property");
    }

    return true;
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * Update a property
 * @param id String
 * @param data FormData
 * @returns Property
 */
async function updateProperty(id: string, data: FormData) {
  try {
    // handle case where domain is not available yet
    if (!apiDomain) return null;

    const res = await fetch(`${apiDomain}/properties/${id}`, { method: "PUT", body: data });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        throw new Error("Permission denied");
      } else {
        throw new Error("Failed to update property");
      }
    }

    return await res.json() as Property;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export { fetchProperties, fetchProperty, fetchUserProperties, deleteProperty, updateProperty };
