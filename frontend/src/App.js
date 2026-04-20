import { useState } from "react";
import Login from "./Login";

import FeedbackForm from './FeedbackForm';
import ComplaintForm from './ComplaintForm';
import ChangePassword from "./ChangePassword";
import Dashboard from './Dashboard';

function App() {
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    setLoggedIn(false);
  };

  return (
    <>
      {!loggedIn ? (
        <Login setLoggedIn={setLoggedIn} />
      ) : (
        <div>
          <button onClick={handleLogout}>Logout</button>

          <Dashboard />

          {role === "student" && (
            <>
              <FeedbackForm />
              <ComplaintForm />
              <ChangePassword />
            </>
          )}
        </div>
      )}
    </>
  );
}
export default App;