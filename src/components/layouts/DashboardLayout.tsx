import DashboardNavbar from "../misc/DashboardNav";

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  return (
    <>
      <DashboardNavbar />
      <div className="mt-10">{children}</div>
    </>
  );
}
