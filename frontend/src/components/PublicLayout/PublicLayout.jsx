import AnnouncementBar from "../../sections/AnnouncementBar/AnnouncementBar";
import Navbar from "../../sections/Navbar/Navbar";
import Footer from "../../sections/Footer/Footer";
import PublicBreadcrumbs from "./PublicBreadcrumbs";

function PublicLayout({ children }) {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <PublicBreadcrumbs />

      {children}

      <Footer />
    </>
  );
}

export default PublicLayout;
