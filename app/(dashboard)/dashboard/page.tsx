import UploadImage from "@/components/upload-image";

export default function Page() {
  return (
    <>
      <div className="border-b">
        <div className="flex items-center px-6">
          <button className="py-4 border-b-2 border-[#4CD964] font-medium">
            Upload Image
          </button>
        </div>
      </div>
      <div className="w-full max-w-2xl mx-auto p-4">
        <UploadImage />
      </div>
    </>
  );
}
