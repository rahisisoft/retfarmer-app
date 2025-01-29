// pages/api/validate.js
import { getSession } from 'next-auth/react'; // If using NextAuth.js for authentication

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (session) {
    // If the session is valid, return the user's role or other relevant data
    res.status(200).json({ status: "success", user: session.user });
  } else {
    // If no session exists, return an error
    res.status(401).json({ status: "error", message: "Unauthorized" });
  }
}