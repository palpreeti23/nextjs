import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signupSchema";

const usernameQuerySchema = z.object({
  username: usernameValidation,
});

async function GET(request: Request) {
  await dbConnect();

  try {
    const { searchParam } = new URL(request.url);
    const queryParam = {
      username: searchParam.get("username"),
    };

    //validate with zod
    const result = usernameQuerySchema.safeParse(queryParam);
    // console.log(result)
    if (!result.success) {
      //   const usernameError = result.error.format().username?._errors || [];

      return Response.json(
        {
          success: false,
          message: "invalid query parameter",
        },
        {
          status: 400,
        },
      );
    }

    const { username } = result.data;
    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified,
    });
    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "username already taken",
        },
        {
          status: 500,
        },
      );
    }

    return Response.json(
      {
        success: true,
        message: "username is unique",
      },
      {
        status: 500,
      },
    );
  } catch (error) {
    console.error("error checking username", error);
    return Response.json(
      {
        success: false,
        message: "error checking username",
      },
      {
        status: 500,
      },
    );
  }
}
