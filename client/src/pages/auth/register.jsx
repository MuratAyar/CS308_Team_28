import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
registerFormControls
//import { useToast } from "@/hooks/use-toast"


//import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
//import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
//import { useNavigate } from "react-router-dom";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister() {
    
  const [formData, setFormData] = useState(initialState);

    
  function onSubmit(event) {
    event

  }


  

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create new account
        </h1>
        <p className="mt-2">
          Already have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={registerFormControls}
        buttonText={"Sign Up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AuthRegister;