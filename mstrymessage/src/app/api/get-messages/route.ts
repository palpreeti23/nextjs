import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { auth } from "../auth/[...nextauth]/options";
// import { getServerSession } from "next-auth";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
  await dbConnect();

  const session = await auth();
  const user: User = session?.user as User;

  if (!session || !session.user) {
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

  const userDoc = await UserModel.findById(userId);
  console.log("USER DOC:", userDoc);
  try {
    const result = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: { path: "$messages", preserveNullAndEmptyArrays: true } },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);

    if (!result || result.length === 0) {
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
        messages: result[0].messages,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("an unExpented error accured", error);
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
