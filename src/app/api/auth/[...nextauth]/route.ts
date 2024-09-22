import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

// Named export for HTTP methods
export { handler as GET, handler as POST };
