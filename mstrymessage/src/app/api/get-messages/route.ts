import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { auth } from "../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = getServerSession(auth);
  const user: User = session?.user;

  if (!session || session.user) {
    return Response.json(
      {
        success: false,
        message: "Not Authenticated",
      },
      {
        status: 400,
      },
    );
  }

  //for aggregation
  const userId = new mongoose.Types.ObjectId(user._id);

  try {
    const user = await UserModel.aggregate([
      { $match: { id: userId } },
      { $unwind: "$messages" },
      { $sort: { "$messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: " messages" } } },
    ]);

    if (!user || user.length === 0) {
      return Response.json(
        {
          success: false,
          message: "user Not found",
        },
        {
          status: 404,
        },
      );
    }

    return Response.json(
      {
        success: true,
        message: user[0].messages,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error(" an unExpented error accured", error);
    return Response.json(
      {
        success: false,
        message: "User not Found",
      },
      {
        status: 500,
      },
    );
  }
}
