import classNames from "classnames";
import { Footer } from "../components/global/Footer/Footer";
import Navbar from "../components/global/Navbar/Navbar";

export const AppLayout = ({ children, className, noFooter }: any) => {
  return (
    <div className={classNames("px-[120px] pt-[100px]", className)}>
      <Navbar />
      <div className="max-w-7xl mx-auto">{children}</div>
      {!noFooter && (
        <div className="mx-[-120px]">
          <Footer />
        </div>
      )}
    </div>
  );
};
