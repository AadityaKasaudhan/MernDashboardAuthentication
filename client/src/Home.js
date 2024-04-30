import React, {useEffect } from "react";


function Home() {

  useEffect(() => {
    const handleBackButton = (e) => {
      e.preventDefault();
      window.history.pushState(null, "", window.location.pathname);
    };

    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, []);
  return (
    <div>
      <h1>Home COmponent</h1>    
    </div>
  );
}

export default Home;
