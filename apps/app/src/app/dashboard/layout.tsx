import TopBar from "../components/dashboard/TopBar";
import Sidebar from "../components/dashboard/Sidebar";

interface DashboardLayoutProps {
    children: React.ReactNode;
}
const layout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="h-screen flex flex-col min-h-screen theme-bg theme-text">
      <div  className="flex-1 flex overflow-hidden ">
        <Sidebar />
        <main  className="flex-1 overflow-y-auto hide-scrollbar min-w-0">
          <TopBar />
          {children}
        </main>
      </div>
    </div>
  )
}

export default layout