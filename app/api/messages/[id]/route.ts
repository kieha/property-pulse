import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getSessionUser } from "@/utils/getSessionUser";

export const dynamic = "force-dynamic";

// PUT /api/messages/<message-id>
export const PUT = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return new Response('Unauthorized; user ID is required', { status: 401 });
    }
    const { userId } = sessionUser;

    await connectDB();

    const { id } = await params;

    const message = await Message.findById(id);
    if (!message) {
      return new Response('Message not found', { status: 404 });
    }

    // verify ownership
    if (message.recipient.toString() !== userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    // update message to read/unread depending on the current status
    message.read = !message.read;
    await message.save();

    return new Response(JSON.stringify(message), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};

// DELETE /api/messages/<message-id>
export const DELETE = async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return new Response('Unauthorized; user ID is required', { status: 401 });
    }
    const { userId } = sessionUser;

    await connectDB();

    const { id } = await params;

    const message = await Message.findById(id);
    if (!message) {
      return new Response('Message not found', { status: 404 });
    }

    // verify ownership
    if (message.recipient.toString() !== userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    await message.deleteOne();

    return new Response("Message deleted", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("Something went wrong", { status: 500 });
  }
};