import { Outlet } from "react-router-dom";

function AuthLayout() {
    return (
        <div className="flex min-h-screen w-full bg-gradient-to-r from-gray-100 to-gray-200">
            {/* Left Side */}
            <div className="lg:flex items-center justify-center bg-black w-1/2 px-12 py-10 rounded-r-lg shadow-lg">
                <div className="max-w-md space-y-6 text-center text-white">
                    <h1 className="text-5xl font-extrabold tracking-tight">Welcome to TwoEight!</h1>
                    <p className="text-lg">Shop the best products at unbeatable prices!</p>
                </div>
            </div>

            {/* Right Side */}
            <div className="flex flex-1 items-center justify-center bg-white px-4 py-12 sm:px-6 lg:px-8 shadow-inner rounded-l-lg">
                <Outlet />
            </div>
        </div>
    );
}

export default AuthLayout;
