import { Route, Routes } from "react-router-dom";
import ChatPage from "./pages/chatPage";
import LoginPage from "./pages/loginPage";
import SignUpPage from "./pages/signUpPage";

const App = () => {
  return (
    <div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
      <div className="pointer-events-none absolute top-0 -left-4 z-0 size-96 bg-pink-500 opacity-20 blur-[100px]" />
      <div className="pointer-events-none absolute bottom-0 -right-4 z-0 size-96 bg-cyan-500 opacity-20 blur-[100px]" />

      <div className="relative z-10 w-full">
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
