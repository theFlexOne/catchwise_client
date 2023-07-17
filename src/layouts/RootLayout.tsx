import Header from "../components/Header";
import { Outlet } from "react-router-dom";


const RootLayout = () => {
  return (
    <div className="h-screen bg-neutral-800 flex flex-col">
      <Header />
      <div className="grow">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
