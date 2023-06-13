import Header from "../components/Header";

interface RootLayoutProps {
  children: React.ReactNode;
  links: { url: string; label: string }[];
}

const RootLayout = ({ children, links }: RootLayoutProps) => {
  return (
    <div className="min-h-screen bg-neutral-800 flex flex-col">
      <Header links={links} />
      <div className="relative grow">{children}</div>
    </div>
  );
};

export default RootLayout;
