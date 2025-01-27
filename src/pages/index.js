import { useEffect } from "react";
import { useRouter } from "next/router";
import Login from "./login"; // Import Login component

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    // Replace this with your session or token validation logic
    const isLoggedIn = false; // Example: Replace with actual login status check

    if (isLoggedIn) {
      router.push("/dashboard"); // Redirect to dashboard if logged in
    }
  }, [router]);

  return (
    <div>
      <Login />
    </div>
  );
};

export default Home;