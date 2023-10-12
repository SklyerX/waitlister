import Tabs from "../Tabs";
import DashboardNavbar from "../misc/DashboardNav";

interface Props {
  children: React.ReactNode;
}

export default function ProjectLayout({ children }: Props) {
  return (
    <>
      <DashboardNavbar />
      <Tabs />
      <div className="mt-10">{children}</div>
    </>
  );
}
