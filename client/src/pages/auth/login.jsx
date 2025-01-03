import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { useToast } from "@/hooks/use-toast";
loginFormControls
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
//import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
//import { useToast } from "@/hooks/use-toast"

const initialState = {
    email: "",
    password: "",
  };
  
  function AuthLogin() {
    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();
    const {toast} = useToast();
    function onSubmit(event) {
        event.preventDefault()
        dispatch(loginUser(formData)).then((data) => {
          if (data?.payload?.success) {
              // Store the token in localStorage
              localStorage.setItem("authToken", data?.payload?.token); // Assuming `token` is part of the payload
              console.log("Token stored in localStorage:", data?.payload?.token);
  
              // Show success toast
              toast({
                  title: data?.payload?.message,
              });
          } else {
              // Show error toast
              toast({
                  title: data?.payload?.message,
                  variant: "destructive",
              });
          }
      });
    }
  
    console.log(formData)
    
    return (
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Sign in to your account
          </h1>
          <p className="mt-2">
            Dont have an account
            <Link
              className="font-medium ml-2 text-primary hover:underline"
              to="/auth/register"
            >
              Register
            </Link>
          </p>
        </div>
        <CommonForm
          formControls={loginFormControls}
          buttonText={"Sign In"}
          formData={formData}
          setFormData={setFormData}
          onSubmit={onSubmit}
        />
      </div>
    );
  }
  
  export default AuthLogin;