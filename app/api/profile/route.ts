import connectDB from "@/config/database";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";

// PUT /api/profile
export const PUT = async (request: Request) => {
  try {
    await connectDB();

    const { name, email } = await request.json();

    // check for session user
    const sessionUser = await getSessionUser();
    if (!sessionUser || !sessionUser.userId) {
      return new Response('User ID is required', { status: 401 });
    }
    const { userId } = sessionUser;

    // find user in database
    const user = await User.findById(userId);
    if (!user) {
      return new Response("User does not exist", { status: 404 });
    }

    // update the user info
    user.username = name;
    user.email = email;
    await user.save();

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });

  }
};