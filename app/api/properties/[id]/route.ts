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
    return new Response("Something went wrong", { status: 500 });
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
    return new Response("Something went wrong", { status: 500 });
  }
}