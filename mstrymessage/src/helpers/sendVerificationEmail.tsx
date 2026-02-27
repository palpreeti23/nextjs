import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/apiResponse";
import { success } from "zod";

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string,
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "mystery message | verification code",
      react: <VerificationEmail username={username} otp={verifyCode} />,
    });

    return { success: true, message: " verification email sent successfully" };
  } catch (emailError: any) {
    console.error(
      "FULL EMAIL ERROR:",
      emailError?.response?.data || emailError,
    );

    // console.error("error sending verification email", emailError);
    return { success: false, message: "failed to send verification email" };
  }
}
