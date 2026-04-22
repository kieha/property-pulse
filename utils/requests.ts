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
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (error) {
    console.log(error);
    return [];
  }
};

/**
 * Fetch a single property
 * @param id 
 * @returns Property
 */
async function fetchProperty(id: string) {
  try {
    // handle case where domain is not available yet
    if (!apiDomain) return null;

    const res = await fetch(`${apiDomain}/properties/${id}`);

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (error) {
    console.log(error);
    return null;
  }
};



export { fetchProperties, fetchProperty };