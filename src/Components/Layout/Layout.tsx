import Header from "../Common/Header/Header";
import Footer from "../Common/Footer/Footer";

interface children {
  children: React.ReactNode;
}

export default function Layout({ children }: children) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
