import AnnouncementBar from "../../sections/AnnouncementBar/AnnouncementBar";
import Navbar from "../../sections/Navbar/Navbar";
import Footer from "../../sections/Footer/Footer";

function PublicLayout({ children }) {
  return (
    <>
      <AnnouncementBar />
      <Navbar />

      {children}

      <Footer />
    </>
  );
}

export default PublicLayout;
