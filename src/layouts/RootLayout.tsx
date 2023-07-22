import Header from "../components/Header";

export type ModalStatusType = {
  path: "login" | "signup";
  redirectPath: string;
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
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
