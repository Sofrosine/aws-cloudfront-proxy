import PopupOk from "@/components/Popup/PopupOk";
import CardRegister from "../(fragments)/CardRegister";

const Register = () => {
  return (
    <div className="flex justify-center items-center h-[100vh] px-4">
      <CardRegister />
      <div className="text-primary text-subtitle-3 absolute bottom-6">
        {/* © 2024 by sewarna creative */}
      </div>
    </div>
  );
};

export default Register;
