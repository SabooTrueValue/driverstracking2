"use client";
import React, { useEffect, useState } from "react";
import { AiOutlineClose, AiOutlineFileSearch, AiOutlineMenu } from "react-icons/ai";
import { BsPeople } from "react-icons/bs";
import { BiHomeAlt2 } from "react-icons/bi";
import SidePanel from "@/components/SidePanel";
import AdminHome from "@/components/AdminHome";
import DriversData from "@/components/DriversData";
import { useAppContext } from "@/context";
import axios from "axios";
import toast from "react-hot-toast";
import DrivesData from "@/components/DrivesData";
import { GrLinkNext } from "react-icons/gr";
import { MdDelete } from "react-icons/md";

import { FiRefreshCw } from "react-icons/fi";
import { FaExternalLinkAlt } from "react-icons/fa";

const Dashboard = () => {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("Home");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState([]);
  const [columns2, setColumns2] = useState([]);
  const [driversData, setDriversData] = useState([]);
  const [totalDriver, setTotalDriver] = useState(0);
  const [totalJourney, setTotalJourney] = useState(0);
  const [totalAvailableDriver, setTotalAvailableDriver] = useState(0);
  const [totalUnavailble, setTotalUnavailable] = useState(0);
  const [imgCol, setImgCol] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);


  const {
    driverData,
    setJournyData,

    journyData,
  } = useAppContext();

  const menuItems = [
    { label: "Home", icon: BiHomeAlt2 },
    { label: "Drives", icon: AiOutlineFileSearch },
    { label: "Drivers", icon: BsPeople },
  ];

  const [rows, setRows] = React.useState([]);
  const [refreshing, setRefreshing] = React.useState(false);

  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(`/api/update/${id}`, {
        /* your update payload */
      });
      console.log("Update successful", response.data);
      // Optionally, update state to reflect changes
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const handleDelete = async (id) => {
    // Show a confirmation dialog to the user
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );

    if (!confirmed) {
      // If the user did not confirm, exit the function
      return;
    }

    try {
      toast.loading("Deleting...");

      const response = await axios.delete(`/api/admin?id=${id}`);
      toast.dismiss();
      console.log("Delete successful", response.data);
      toast.success("Deleted successfully");

      // Refresh the state or update it accordingly
      setRefreshing(!refreshing);

      // Optionally, update state to remove the deleted row
      setRows(rows.filter((row) => row._id !== id));
    } catch (error) {
      console.error("Delete failed", error);
      toast.dismiss();
      toast.error("Delete failed");
    }
  };

  const handleShowImages = async (img) => {
    console.log(img);
    toast.success("Showing images");

    setImgCol(img);
    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/admin");

        if (res.data.data) {
          setTotalDriver(res.data.data.length);

          let totalAvailable = 0;
          let totalUnavailable = 0;

          // Transform driver data and count available drivers
          const driverData = res.data.data.map((item, index) => {
            if (item.isDriving === false) {
              totalAvailable += 1;
            } else {
              totalUnavailable += 1;
            }

            return {
              ...item,
              id: index + 1,
              isDriving: item.isDriving === true,
            };
          });

          setTotalAvailableDriver(totalUnavailable);

          setTotalUnavailable(totalAvailable);

          // Set driver columns
          setColumns([
            { field: "id", headerName: "Sr. No", flex: 0.5 },
            { field: "employeeId", headerName: "Emp ID", flex: 0.5 },
            {
              field: "isDriving",
              headerName: "Status",
              flex: 0.5,
              renderCell: (params) => (
                <div className="flex items-center">
                  <span
                    className={`text-sm rounded px-4 py-1 mt-1 text-black font-medium ${
                      params.row.isDriving ? "bg-red-100" : "bg-green-100"
                    }`}
                  >
                    {params.row.isDriving ? "Driving" : "Available"}
                  </span>
                </div>
              ),
            },
            { field: "name", headerName: "Name", flex: 1 },
            { field: "phone", headerName: "Phone Number", flex: 1 },
            { field: "totalDrives", headerName: "Total Drives ", flex: 0.5 },

            // {
            //   field: "update",
            //   headerName: "Update",
            //   flex: 0.5,
            //   renderCell: (params) => (
            //     <button
            //       onClick={() => handleUpdate(params.row.id)}
            //       className="px-2 py-1 text-blue-500 rounded"
            //     >
            //       <GoPencil className="text-xl" />
            //     </button>
            //   ),
            // },
            {
              field: "delete",
              headerName: "Delete",
              flex: 0.5,
              renderCell: (params) => (
                <button
                  onClick={() => handleDelete(params.row._id)}
                  className="px-2 py-2 text-red-500 rounded"
                >
                  <MdDelete className="text-2xl" />
                </button>
              ),
            },
          ]);

          setDriversData(driverData);
        }

        if (res.data.journeyData) {
          setTotalJourney(res.data.journeyData.length);

          // Transform journey data
          const journeyData = res.data.journeyData.map((item, index) => {
            // Add separate fields for location entries
            const locations = item.location || [];
            return {
              ...item,
              id: index + 1,
              location1: locations[0]
                ? `${locations[0].formattedLocation} - (${locations[0].time}) `
                : "",
              location2: locations[1]
                ? `${locations[1].formattedLocation} - (${locations[1].time}) (${locations[1].detail}) `
                : "",
              location3: locations[2]
                ? `${locations[2].formattedLocation} - (${locations[2].time}) `
                : "",
            };
          });

          // Set journey columns
          setColumns2([
            // { field: "id", headerName: "Sr No" },
            { field: "date", headerName: "Date" },
            // { field: "time", headerName: "Time" },
            { field: "employeeId", headerName: "Emp ID" },
            {
              field: "status",
              headerName: "Status",
              width: 150,
              renderCell: (params) => (
                <div className="flex items-center">
                  <span
                    className={`text-sm rounded px-4 py-1 mt-1 text-black font-medium ${
                      params.row.status === "Drive Ended"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    {params.row.status}
                  </span>
                </div>
              ),
            },
            {
              field: "images",
              headerName: "Images",
              width: 120,
              renderCell: (params) =>
                params.row.images?.length ? (
                  <button
                    onClick={() => handleShowImages(params.row.images)}
                    className="py-1"
                  >
                    <div className="flex justify-center min-w-12">
                      <FaExternalLinkAlt className="mx-auto text-xl" />
                    </div>
                  </button>
                ) : (
                  <p>No Image</p>
                ),
            },

            { field: "driverName", headerName: "Driver Name", width: 150 },
            {
              field: "vehicleNumber",
              headerName: "Vehicle Number",
              width: 150,
            },
            {
              field: "modeOfTransport",
              headerName: "Mode ",
              // width: 150,
            },
            {
              field: "journeyType",
              headerName: "Type ",
              // width: 150,
            },

            { field: "location1", headerName: "Start ", flex: 0.5 },
            {
              field: "location2",
              headerName: "Picked Up/Drop ",
              flex: 0.5,
            },
            {
              field: "location3",
              headerName: "End ",
              flex: 0.5,
            },
          ]);

          setJournyData(journeyData);
        }
      } catch (err) {
        setError(err.message || "Something went wrong");
        toast.error("Token expired, Please login again");
        window.location.href = "/login";
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshing]);

  return (
    <div className="flex bg-gray-100">
      <div className="z-20">
        <SidePanel
          open={open}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          setOpen={setOpen}
          menuItems={menuItems}
        />
      </div>

      <div className="relative flex-auto font-roboto ">
        <div className="flex items-center justify-between w-full px-2 py-4 text-blue-800 select-none h-14">
          <AiOutlineMenu
            className="text-3xl cursor-pointer md:hidden"
            onClick={() => setOpen(!open)}
          />
          <div
            onClick={() => setRefreshing(!refreshing)}
            className="flex items-center gap-2 px-4 py-1 text-sm text-white bg-blue-800 rounded-full cursor-pointer hover:bg-blue-700 group"
          >
            <FiRefreshCw className="group-hover:animate-spin " />
            <p> Refresh</p>
          </div>{" "}
          <p className="text-lg">{driverData?.name}</p>
          {/* <p className="hidden px-4 text-sm md:block">{driverData?.phone}</p> */}
        </div>
        <div className="bg-white rounded-tl-2xl px-2 lg:px-4 py-6 h-[calc(100vh-56px)]  ">
          {selectedItem === "Home" ? (
            <AdminHome
              totalDriver={totalDriver}
              totalJourney={totalJourney}
              setSelectedItem={setSelectedItem}
              totalAvailableDriver={totalAvailableDriver}
              totalUnavailble={totalUnavailble}
            />
          ) : selectedItem === "Drives" ? (
            <DrivesData
              error={error}
              loading={loading}
              columns={columns2}
              data={journyData}
            />
          ) : selectedItem === "Drivers" ? (
            <DriversData
              error={error}
              loading={loading}
              columns={columns}
              data={driversData}
              setRefreshing={setRefreshing}
              refreshing={refreshing}
            />
          ) : null}
        </div>
      </div>
      {imgCol && (
        <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-gray-50 translate-x-[33%] translate-y-[33%] rounded-lg shadow-lg">
          <div className="relative w-full h-full">
            <button
              onClick={() => setImgCol(null)}
              className="absolute top-0 right-0 p-2"
            >
              <AiOutlineClose className="text-4xl text-red-600" />
            </button>

            {imgCol.length > 0 && (
              <img
                src={imgCol[currentIndex]}
                className="object-cover w-full h-full rounded-lg"
                alt={`Image ${currentIndex + 1}`}
              />
            )}

            <button
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev > 0 ? prev - 1 : imgCol.length - 1
                )
              }
              className="absolute p-2 transform -translate-y-1/2 bg-white rounded-full shadow-lg left-2 top-1/2"
            >
              <GrLinkNext className="rotate-180" />
            </button>

            <button
              onClick={() =>
                setCurrentIndex((prev) =>
                  prev < imgCol.length - 1 ? prev + 1 : 0
                )
              }
              className="absolute p-2 transform -translate-y-1/2 bg-white rounded-full shadow-lg right-2 top-1/2"
            >
              <GrLinkNext />
            </button>
            {/* <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = imgCol[currentIndex];
                link.download = `image-${currentIndex + 1}`; // Customize the filename as needed
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="absolute p-2 px-4 text-sm text-white transform bg-blue-500 rounded-full shadow-lg left-4 top-4"
            >
              Download
            </button> */}
            <button
              onClick={() => window.open(imgCol[currentIndex], "_blank")}
              className="absolute p-2 px-4 text-sm text-white transform bg-blue-600 rounded-full shadow-lg left-4 top-4"
            >
              Open in New Tab
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
