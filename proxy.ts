import { auth as proxy } from "@/auth";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export default proxy(async (req) => {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    cookieName: process.env.NODE_ENV === "production"
      ? "__Secure-authjs.session-token"
      : "authjs.session-token"
  });

  console.log({ token });


  if (!token) {
    // Redirect to sign-in page if the token is not found
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/properties/add", "/profile", "/properties/saved", "/messages"],
};
