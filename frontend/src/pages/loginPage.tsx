import { useAuthStore } from "../store/useAuthStore";

function LoginPage() {
  const { authUser, isLoggedIn, login, isLoading } = useAuthStore();

  console.log("auth user:", authUser);
  console.log("isLoggedIn:", isLoggedIn);
  console.log("isLoading:", isLoading);
  return (
    <div>
      <div className="text-yellow-100">LoginPage</div>;
      <button
        className="relative z-10 cursor-pointer text-yellow-100"
        onClick={login}
      >
        login
      </button>
    </div>
  );
}

export default LoginPage;
