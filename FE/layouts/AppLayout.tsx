import { AiOutlineSearch } from "react-icons/ai";
import AppNavbar from "../components/pages/App/AppNavbar/AppNavbar";

interface AppLayoutProps {
  children: React.ReactNode;
  title: string;
  noSearch?: boolean;
}

const AppLayout = ({ children, title, noSearch = false }: AppLayoutProps) => {
  return (
    <div className="min-h-screen flex font-quicksand">
      <AppNavbar />
      <div className="flex-1 flex flex-col flex-shrink-0">
        <div className="h-16 border-b flex items-center px-10 flex-shrink-0 sticky top-0 bg-white z-30 shadow-sm">
          <h2 className="text-xl font-bold">{title}</h2>
          {!noSearch && false && (
            <div
              className="bg-[#F6F6F9] flex ml-4 items-center rounded-md
          focus-within:bg-white border border-[#F6F6F9] focus-within:border-blue-500 transition-all"
            >
              <div className="p-2 text-xl">
                <AiOutlineSearch />
              </div>
              <input
                className="p-1.5 bg-transparent -ml-2 w-[240px]"
                placeholder="Search..."
              />
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col bg-[#F6F6F9]">{children}</div>
      </div>
    </div>
  );
};

export default AppLayout;
