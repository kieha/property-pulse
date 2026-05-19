import { auth } from "@/auth";

export { auth as proxy };

export const config = {
  matcher: ["/properties/add", "/profile", "/properties/saved", "/messages"],
};
