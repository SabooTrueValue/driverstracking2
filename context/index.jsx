"use client";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const AppContext = createContext();

export function AppWrapper({ children }) {
  const [driverData, setDriverData] = useState(null);
  const [journyData, setJournyData] = useState([]);
  const [isDriving, setIsDriving] = useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    const isAdmin = Cookies.get("isAdmin");
    if (token) {
      getDriverData();
      journeyData();
    }
    if (window.location.pathname === "/admin" && !isAdmin) {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    // Define an asynchronous function inside useEffect
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/active");
        console.log(response.data);
        // Handle the response data as needed, e.g., set it to state
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle the error appropriately
      }
    };

    const token = Cookies.get("token");
    if (token) {
      fetchData();
    }
  }, []); // Dependency array

  const getDriverData = async () => {
    try {
      const response = await axios.get(`/api/driver/user`);

      setDriverData(response.data?.data);
      // setJournyData(response.data.journy);

      setIsDriving(response.data.data.isDriving);
      //   if (response.data?.journeyData?.length > 0) {
      //     setJournyData(response.data?.journeyData);
      //   }
      console.log(
        "🚀 ~ file: page.tsx:Home ~ getDriverData ~ response.data:",
        response.data
      );
    } catch (error) {
      console.error("Error fetching data in:", error);

      window.location.href = "/login";
    }
  };
  const journeyData = async () => {
    try {
      const response = await axios.get(`/api/journey`);

      if (response.data?.data?.length > 0) {
        setJournyData(response.data?.data);
      }
      console.log(
        "🚀 ~ file: page.tsx:Home ~ getJourneyData ~ response.data:",
        response.data
      );
    } catch (error) {
      console.error("Error fetching data in:", error);

      window.location.href = "/login";
    }
  };

  return (
    <AppContext.Provider
      value={{
        driverData,
        setDriverData,
        journyData,
        setJournyData,
        isDriving,
        setIsDriving,
        getDriverData,
        journeyData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
