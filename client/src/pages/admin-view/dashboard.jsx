import React from "react";
import Sidebar from "@/components/admin-view/sidebar";
import Header from "@/components/admin-view/header";
import Users from "./users";

const Dashboard = () => {
    return (
        <div className="dashboard">
            <Sidebar />
            <div className="main-content">
                <Header />
                <Users />
            </div>
        </div>
    );
};

export default Dashboard;
