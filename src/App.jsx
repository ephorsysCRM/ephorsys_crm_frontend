import { useEffect } from "react";
import { useSelector } from "react-redux";
import { joinUserRoom } from "../src/services/authSocket.js";
import AppRoutes from "./routes";

function App() {
  const user = useSelector((state) => state.auth.user); 

  useEffect(() => {
    // Reconnect socket on page refresh if user is still logged in
    if (user?._id) {
      joinUserRoom(user._id);
    }
  }, [user]);

  return <AppRoutes />;
}

export default App;