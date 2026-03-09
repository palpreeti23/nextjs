// import { getServerSession } from "next-auth";
import UserModel from "@/model/User";
import dbConnect from "@/lib/dbConnect";
import { User } from "next-auth";
import { auth } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
  await dbConnect();

  const session = await auth();

  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "not authenticated",
      },
      {
        status: 401,
      },
    );
  }

  const userId = user._id;
  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true },
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "failed to update user status to accept messages",
        },
        {
          status: 401,
        },
      );
    }

    return Response.json(
      {
        success: true,
        message: "messages acceptance status updated successfully",
        updatedUser,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("failed to update user status to accept messages", error);
    return Response.json(
      {
        success: false,
        message: "failed to update user status to accept messages",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET(request: Request) {
  await dbConnect();

  const session = await auth();

  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json(
      {
        success: false,
        message: "not authenticated",
      },
      {
        status: 401,
      },
    );
  }

  try {
    const userId = user._id;
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: "user not found",
        },
        {
          status: 404,
        },
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("failed to update user status to accept messages");
    return Response.json(
      {
        success: false,
        message: "error in getting message acceptance status",
      },
      {
        status: 500,
      },
    );
  }
}
