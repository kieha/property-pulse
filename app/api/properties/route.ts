import cloudinary from "@/config/cloudinary";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import type { NextRequest } from "next/server";

// GET /api/properties
export const GET = async (request: NextRequest) => {
  try {
    await connectDB();

    const page = request.nextUrl.searchParams.get("page") || 1;
    const pageSize = request.nextUrl.searchParams.get("pageSize") || 6;
    const skip = (Number(page) - 1) * Number(pageSize);

    const total = await Property.countDocuments({});
    const properties = await Property.find({}).skip(skip).limit(Number(pageSize));

    return new Response(JSON.stringify({ total, properties }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
}

// POST /api/properties
export const POST = async (request: Request) => {
  try {
    await connectDB();

    // get the user id from the session
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return new Response('Unauthorized; user ID is required', { status: 401 });
    }

    const formData = await request.formData();

    // access all values from amenities and images
    const amenities = formData.getAll("amenities");
    const images = formData.getAll("images").filter((image): image is File => image instanceof File);

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
      owner: sessionUser.userId,
      images: [""],
    };

    // upload image(s) to Cloudinary
    const imageUploadPromises: Array<string> = [];

    for (const image of images) {
      const imageBuffer = await image.arrayBuffer();
      const imageArray = Array.from(new Uint8Array(imageBuffer));
      const imageData = Buffer.from(imageArray);

      // convert the image data to base64
      const imageBase64 = imageData.toString('base64');

      // make request to upload to Cloudinary
      const result = await cloudinary.uploader.upload(`data:image/png;base64,${imageBase64}`, {
        folder: 'propertypulse',
      });

      imageUploadPromises.push(result.secure_url);

      // wait for all images to upload
      const uploadedImages = await Promise.all(imageUploadPromises);
      // add uploaded images to the propertyData object
      propertyData.images = uploadedImages;
    }

    const newProperty = new Property(propertyData);
    await newProperty.save();

    return new Response(JSON.stringify(newProperty), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Failed to add property", { status: 500 });
  }
}