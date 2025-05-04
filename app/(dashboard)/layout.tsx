import Sidebar from "@/components/dashboard/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen relative">
      <div className="hidden fixed h-full md:flex md:w-72 z-[80] bg-gray-900">
        <Sidebar />
      </div>

      <main className="md:pl-72 w-full">{children}</main>
    </div>
  );
}
