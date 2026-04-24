import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";

// GET /api/properties/<property-id>
export const GET = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {

  try {
    await connectDB();

    const { id } = await params;
    const property = await Property.findById(id);

    if (!property) return new Response('Property not found', { status: 404 });
    
    return new Response(JSON.stringify(property), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to get property", { status: 500 });
  }
}

// DELETE /api/properties/<property-id>
export const DELETE = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {

  try {
    const { id: propertyId } = await params;
    
    // check for session user
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return new Response('User ID is required', { status: 401 });
    }
    const { userId } = sessionUser;

    await connectDB();

    const property = await Property.findById(propertyId);

    if (!property) return new Response('Property not found', { status: 404 });

    // verify ownership
    if (property.owner.toString() !== userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    await property.deleteOne();
    
    return new Response('Property deleted', { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to delete property", { status: 500 });
  }
}

// PUT /api/properties/<property-id>
export const PUT = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    // get the user id from the session
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return new Response('Unauthorized; user ID is required', { status: 401 });
    }
    const { userId } = sessionUser;

    await connectDB();

    // get property to update
    const { id: propertyId } = await params;
    const existingProperty = await Property.findById(propertyId);
    if (!existingProperty) {
      return new Response("Property does not exist", { status: 404 });
    }

      // verify ownership
    if (existingProperty.owner.toString() !== userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();

    // access all values from amenities and images
    const amenities = formData.getAll("amenities");

    // create propertyData object for database
    const propertyData = {
      type: formData.get("type"),
      name: formData.get("name"),
      description: formData.get("description"),
      location: {
        street: formData.get("location.street"),
        city: formData.get("location.city"),
        state: formData.get("location.state"),
        zipcode: formData.get("location.zipcode"),
      },
      beds: formData.get("beds"),
      baths: formData.get("baths"),
      square_feet: formData.get("square_feet"),
      amenities,
      rates: {
        nightly: formData.get("rates.nightly"),
        weekly: formData.get("rates.weekly"),
        monthly: formData.get("rates.monthly"),
      },
      seller_info: {
        name: formData.get("seller_info.name"),
        email: formData.get("seller_info.email"),
        phone: formData.get("seller_info.phone"),
      },
      owner: userId,
    };

    // update property in database
    const updatedProperty = await Property.findByIdAndUpdate(propertyId, propertyData);

    return new Response(JSON.stringify(updatedProperty), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to update property", { status: 500 });
  }
}