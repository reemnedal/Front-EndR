import React, { useState, useEffect } from "react";
import {
  CalendarIcon,
  Users,
  MessageSquare,
  Star,
  BarChart2,
  Package,
} from "lucide-react";
import Header from "./Header";
import TabButton from "./TabButton";
import ServicesTab from "./ServicesTab";
import ClientsTab from "./ClientsTab";
import AnalyticsTab from "./AnalyticsTab";
import { fetchUser } from "../../redux/users/userThunk";
import { useDispatch, useSelector } from "react-redux";
// import AddData from "../../../Components/Hooks/customHooks/postData";
// import useFetchData from "./../../../Components/Hooks/customHooks/get";

const TherapistDashboard = () => {
  const dispatch = useDispatch();
  const {
    user,
    loading: userLoading,
    error: userError,
    isAuthenticated,
  } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("analytics");
  const [services, setServices] = useState([]);

  // Use the custom hook for fetching appointments

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  const tabComponents = {
    analytics: <AnalyticsTab />,
    services: <ServicesTab services={services} setServices={setServices} />,
    clients: <ClientsTab />,
  };

  const tabIcons = {
    services: Package,
    clients: Users,
    analytics: BarChart2,
  };

  if (userLoading) {
    return <div>Loading...</div>;
  }

  // if (userError) {
  //   return <div>Error: {userError}</div>;
  // }

  return (
    <div className="min-h-screen bg-[#prime-white]">
      <div className="container mx-auto p-6 space-y-6">
        <Header user={user} />

        <div className="bg-white rounded-lg shadow-md p-2 flex space-x-2 overflow-x-auto">
          {Object.keys(tabComponents).map((tab) => {
            const Icon = tabIcons[tab];
            return (
              <TabButton
                key={tab}
                icon={Icon}
                label={tab.charAt(0).toUpperCase() + tab.slice(1)}
                isActive={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              />
            );
          })}
        </div>

        <div className="mt-6">{tabComponents[activeTab]}</div>
      </div>
    </div>
  );
};
export default TherapistDashboard;
