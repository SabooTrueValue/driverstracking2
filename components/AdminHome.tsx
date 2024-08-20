import React from "react";

import { FaRoute, FaTruck, FaUser, FaUserAlt, FaUsers } from "react-icons/fa";

import { MdEdit, MdNavigateNext } from "react-icons/md";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaGears } from "react-icons/fa6";
import { BarChart } from "@mui/x-charts/BarChart";
import CountUp from "react-countup";

import { RiHome2Line, RiPencilFill } from "react-icons/ri";
// import DriversData from "./DriversData";
import { HiPlus } from "react-icons/hi";

interface AdminData {
  totalDriver: number;
  totalJourney: number;
  setSelectedItem: React.Dispatch<React.SetStateAction<string>>;
  totalAvailableDriver: number;
  totalUnavailble: number;
}

const AdminHome: React.FC<AdminData> = ({
  totalDriver,
  totalJourney,
  setSelectedItem,

  totalAvailableDriver,
  totalUnavailble,
}) => {
  return (
    <div className="px-2 ">
      <p className="pb-3 text-xl font-semibold text-blue-800 ">Dashboard</p>
      <div className="grid w-full h-full gap-4 rounded-lg md:grid-cols-2 lg:grid-cols-3 ">
        <div className="flex flex-wrap gap-2 md:col-span-2 lg:flex-nowrap">
          <div className="px-4 py-3 rounded-lg min-w-20 min-h-20 bg-gray-300/20 lg:min-h-28 lg:min-w-28 lg:w-full">
            <div className="p-2 rounded-lg bg-blue-500/20 w-min ">
              <FaUsers className="text-3xl text-blue-600" />
            </div>
            <p className="pt-2 text-sm">Total Drivers</p>
            <p className="text-4xl font-semibold">
              <CountUp start={0} end={totalDriver} duration={2} />
            </p>
          </div>
          <div className="px-4 py-3 rounded-lg min-w-20 min-h-20 bg-gray-300/20 lg:min-h-28 lg:min-w-28 lg:w-full">
            <div className="p-2 rounded-lg bg-green-500/20 w-min ">
              <BsFillPeopleFill className="text-3xl text-green-600" />
            </div>

            {/* </div> */}
            <p className="pt-2 text-sm">Total Available Drivers</p>
            <p className="text-4xl font-semibold ">
              {" "}
              <CountUp start={0} end={totalUnavailble} duration={2} />
            </p>
          </div>
          <div className="px-4 py-3 rounded-lg min-w-20 min-h-20 bg-gray-300/20 lg:min-h-28 lg:min-w-28 lg:w-full">
            <div className="p-2 rounded-lg bg-red-500/20 w-min ">
              <BsFillPeopleFill className="text-3xl text-red-600" />
            </div>
            <p className="pt-2 text-sm">Total Driving Drivers </p>
            <p className="text-4xl font-semibold ">
              {" "}
              <CountUp start={0} end={totalAvailableDriver} duration={2} />
            </p>
          </div>
          <div className="px-4 py-3 rounded-lg min-w-20 min-h-20 bg-gray-300/20 lg:min-h-28 lg:min-w-28 lg:w-full">
            <div className="p-2 rounded-lg bg-violet-500/20 w-min ">
              <FaTruck className="text-3xl text-violet-600" />
            </div>
            <p className="pt-2 text-sm">Total Drives</p>
            <p className="text-4xl font-semibold ">
              <CountUp start={0} end={totalJourney} duration={2} />
            </p>
          </div>
        </div>

        <div className="min-h-20">
          <div className="p-2 space-y-2 rounded-lg min-w-20 min-h-20 bg-gray-300/20 lg:min-h-28 lg:min-w-28 md:w-full">
            <div
              onClick={() => setSelectedItem("Drivers")}
              className="flex items-center justify-between p-2 cursor-pointer rounded-xl bg-gray-50 hover:bg-green-500/20"
            >
              <div className="flex items-center gap-2 ">
                <div className="p-4 rounded-full w-min bg-green-500/20">
                  <FaUser className="text-lg text-green-800" />
                </div>
                <p>Add Driver</p>
              </div>

              <div className="p-3 rounded-full bg-gray-500/20 w-min ">
                <HiPlus />
              </div>
            </div>
            <div
              onClick={() => setSelectedItem("Drivers")}
              className="flex items-center justify-between p-2 cursor-pointer rounded-xl bg-gray-50 hover:bg-blue-500/20 "
            >
              <div className="flex items-center gap-2 ">
                <div className="p-4 rounded-full w-min bg-blue-500/20">
                  <FaUser className="text-lg text-blue-800" />
                </div>
                <p>Update Driver Details</p>
              </div>

              <div className="p-3 rounded-full bg-gray-500/20 w-min ">
                <RiPencilFill />
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-lg min-h-40 bg-gray-300/20 md:col-span-2">
          <BasicBars />
        </div>
        <div className="flex flex-col gap-2 p-2 rounded-lg bg-gray-300/20">
          <div
            onClick={() => setSelectedItem("Drives")}
            className="flex items-center justify-between p-2 rounded-xl bg-gray-50 hover:bg-blue-500/20"
          >
            <div className="flex items-center gap-2 ">
              <div className="p-4 rounded-full w-min bg-blue-500/20">
                <FaGears className="text-2xl text-blue-800" />
              </div>
              <p>Picked Up</p>
            </div>

            <div className="p-3 rounded-full bg-gray-500/20 w-min ">
              <MdNavigateNext />
            </div>
          </div>
          <div
            onClick={() => setSelectedItem("Drives")}
            className="flex items-center justify-between p-2 rounded-xl bg-gray-50 hover:bg-green-500/20"
          >
            <div className="flex items-center gap-2 ">
              <div className="p-4 rounded-full w-min bg-green-500/20">
                <RiHome2Line className="text-xl text-green-800" />
              </div>
              <p>Picked Up</p>
            </div>

            <div className="p-3 rounded-full bg-gray-500/20 w-min ">
              <MdNavigateNext />
            </div>
          </div>
          <div
            onClick={() => setSelectedItem("Drives")}
            className="flex items-center justify-between p-2 rounded-xl bg-gray-50 hover:bg-cyan-500/20"
          >
            <div className="flex items-center gap-2 ">
              <div className="p-4 rounded-full w-min bg-cyan-500/20">
                <FaRoute className="text-xl text-cyan-800" />
              </div>
              <p>All Drives</p>
            </div>

            <div className="p-3 rounded-full bg-gray-500/20 w-min ">
              <MdNavigateNext />
            </div>
          </div>
        </div>
        <div className="rounded-lg md:col-span-2">
          {" "}
          {/* <DriversDetails /> */}
        </div>
        <div className="rounded-lg min-h-20"></div>
      </div>
    </div>
  );
};

export default AdminHome;

const BasicBars = () => {
  return (
    <BarChart
      xAxis={[
        {
          scaleType: "band",
          data: [
            "01/08/24",
            "02/08/24",
            "03/08/24",
            "04/08/24",
            "05/08/24",
            "06/08/24",
            "07/08/24",
          ],
        },
      ]}
      series={[{ data: [4, 8, 5, 10, 2, 4, 10], color: "#1e40af" }]} // Single series with data
      className="w-full min-w-20 min-h-20 "
      borderRadius={20}
      // height={20}
    />
  );
};

const Section1 = () => {
  return (
    <section className="w-full rounded-lg ">
      <div className="grid w-full gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        <div className="p-2 rounded-lg bg-gray-50 lg:px-4">
          <p className="text-sm ">Drive Statistic:</p>
          <p>
            <span className="text-lg font-medium ">Today&apos;s Drive: </span>{" "}
            <span className="text-xl text-gray-800"> 4 </span>
          </p>
          <p>
            <span className="text-lg font-medium ">Total Drive: </span>{" "}
            <span className="text-xl text-gray-800"> 10 </span>
          </p>
        </div>
        <div className="p-2 rounded-lg bg-gray-50 lg:px-4">
          <p>Drivers Statistic</p>
          <p>
            <span className="text-lg font-bold text-green-600">
              Available:{" "}
            </span>{" "}
            <span className="text-xl text-gray-800"> 10 </span>
          </p>

          <p>
            <span className="text-lg font-bold text-red-600">Driving: </span>{" "}
            <span className="text-xl text-gray-800"> 4 </span>
          </p>
        </div>
        <div className="lg:col-span-2 group">
          <p className="pb-2 text-2xl font-light text-gray-500/80 md:text-3xl group-hover:text-blue-600">
            Actions
          </p>
          <div className="flex flex-wrap gap-4 whitespace-nowrap lg:gap-2">
            <button
              aria-label="Start"
              className="flex items-center justify-center gap-2 p-2 text-white bg-blue-800 rounded-lg md:px-4 hover:shadow-xl lg:w-52"
            >
              <FaUserAlt />
              <span className="text-sm">Add New Driver</span>
            </button>
            <button
              aria-label="Start"
              className="flex items-center justify-center gap-2 p-2 text-white bg-blue-800 rounded-lg shadow-blue-900 md:px-4 hover:shadow-xl lg:w-52"
            >
              <MdEdit className="lg:text-lg" />
              <span className="text-sm"> Update Profile</span>
            </button>
            {/* <button
              aria-label="Start"
              className="flex items-center gap-2 p-2 text-white bg-blue-800 rounded-lg md:px-4 "
            >
              <FaCar />
              Start New Drive
            </button> */}
          </div>
        </div>
      </div>
    </section>
  );
};

const Section2 = () => {
  return (
    <section className="grid w-full gap-2 mt-2 rounded-lg md:grid-cols-2 ">
      <div className="p-2 border rounded-lg h-1/2 min-h-60 bg-blue-200/30 ">
        Colum 1
      </div>
      <div className="p-2 border rounded-lg h-1/2 min-h-60 bg-blue-200/30 ">
        Colum 2
      </div>
      <div className="p-2 border rounded-lg h-1/2 min-h-60 bg-blue-200/30 ">
        Colum 3
      </div>
      <div className="p-2 border rounded-lg h-1/2 min-h-60 bg-blue-200/30 ">
        Colum 4
      </div>
    </section>
  );
};

const Section3 = () => {
  return (
    <section className="w-full h-full p-2 mt-2 rounded-lg bg-blue-200/30 min-h-32">
      Section 3
    </section>
  );
};
