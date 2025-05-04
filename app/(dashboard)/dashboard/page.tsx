import Navbar from "@/components/dashboard/dashboard-navbar";
import UploadImage from "@/components/dashboard/upload-image";

export default function Page() {
  return (
    <>
      <Navbar title="Dashboard" />
      <div className="w-full mx-auto p-4 h-full">
        <UploadImage />
      </div>
    </>
  );
}
