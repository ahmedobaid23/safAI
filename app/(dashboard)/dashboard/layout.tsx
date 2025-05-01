import Navbar from "@/components/dashboard-navbar";
import Sidebar from "@/components/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full relative">
      <div className="hidden fixed h-full md:flex md:w-72 z-[80] bg-gray-900">
        <Sidebar />
      </div>

      <main className="md:pl-72 w-full">
        <Navbar />
        {children}
      </main>
    </div>
  );
}
