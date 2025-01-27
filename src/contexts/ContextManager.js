import { useCart } from "../contexts/CartContext";
import { useUser } from "../contexts/UserContext";

export function useResetAllContexts() {
  const { resetCart } = useCart();
  const { resetUser } = useUser();

  return () => {
    resetCart();
    resetUser();
  };
}
