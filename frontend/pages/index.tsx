import React from "react";
import Header from "../components/layout/header";
import Sidebar from "../components/layout/sidebar";
const HomePage = () => {
  return (
    <div>
      <Header />
      <div className="flex h-screen border-collapse overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto overflow-x-hidden pt-16 bg-secondary/10 pb-1">
          <>123</>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
