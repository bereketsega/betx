import GoogleLogin from "react-google-login";
import { useState } from "react";
import "./App.css";

function App() {
  // set the user info if found in local storage
  const [userInfo, setuserInfo] = useState(
    localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null
  );

  const handleLoginFailure = (res) => {
    alert(res);
  };

  const handleLoginSuccess = async (googleResponse) => {
    // post request to store user info
    const res = await fetch("/api/google-login", {
      method: "POST",
      body: JSON.stringify({
        token: googleResponse.tokenId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    // user data response from backend
    const data = await res.json();
    setuserInfo(data);
    localStorage.setItem("loginData", JSON.stringify(data));
  };

  const handleLogout = () => {
    localStorage.removeItem("loginData");
    setuserInfo(null);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Betx</h1>
        <div>
          {userInfo ? (
            // display if user is logged in
            <div>
              <h3>Home</h3>
              <button onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            // display if the user is not logged in
            <GoogleLogin
              clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
              buttonText="Log in with Google"
              onSuccess={handleLoginSuccess}
              onFailure={handleLoginFailure}
              cookiePolicy={"single_host_origin"}
            ></GoogleLogin>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
