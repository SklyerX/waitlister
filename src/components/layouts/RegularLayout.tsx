import Navbar from "../misc/Navbar";

interface Props {
  children: React.ReactNode;
}

export default function RegularLayout({ children }: Props) {
  return (
    <>
      <Navbar />
      <div className="mt-10">{children}</div>
    </>
  );
}
