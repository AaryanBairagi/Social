import Navbar from "@/global/Navbar";

export default function Layout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <>
      <Navbar/>
      <div>
        {children}
      </div>
    </>
  )
}

