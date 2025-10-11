import loader from "@/assets/loader.gif";
import Image from "next/image";

const styleLoading = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  width: "100vw",
};

const LoadingPage = () => {
  return (
    <div style={styleLoading}>
      <Image src={loader} height={150} width={150} alt="Loading..." />
    </div>
  );
};

export default LoadingPage;
