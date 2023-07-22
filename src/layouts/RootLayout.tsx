import Header from "../components/Header";
import { Outlet } from "react-router-dom";


const RootLayout = ({ children }: any) => {
  return (
    <div className="h-screen bg-white flex flex-col">
      <Header />
      <main className="grow">
        {children}
      </main>
    </div>
  );
};

export default RootLayout;
