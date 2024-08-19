"use client";
import React, { useState } from "react";

import { IoIosLogOut } from "react-icons/io";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { TbLoader3 } from "react-icons/tb";
// import { useAppContext } from "@/context";

import { FiCamera } from "react-icons/fi";

const User = () => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState(Array(5).fill(null));
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [modeOfTransport, setModeOfTransport] = useState("");
  const [pickupOrDrop, setPickupOrDrop] = useState("");

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("driverId");
    Cookies.remove("_id");
    Cookies.remove("journeyId");
    toast.success("Logout Successfully");
    window.location.href = "/login";
  };

  const DEFAULT_IMAGES = [
    "https://thumbs.dreamstime.com/z/elegant-super-car-black-white-line-art-vector-car-left-front-side-view-drawing-car-black-white-car-elegant-super-car-black-304888571.jpg",
    "https://as1.ftcdn.net/v2/jpg/02/01/86/18/1000_F_201861875_R1Qvq0ipQvtvEmLnrVr7xceverSY5ufN.jpg",
    "https://png.pngtree.com/png-clipart/20230120/original/pngtree-black-car-back-silhouette-clipart-png-image_8923151.png",
    "https://static.vecteezy.com/system/resources/previews/035/838/071/non_2x/car-black-and-white-illustration-vector.jpg",
    "https://media.istockphoto.com/id/1346703769/vector/isolated-speedometer-car-mileage-measuring-kilometers-circle-speed-control-accelerating.jpg?s=1024x1024&w=is&k=20&c=Ql4N6GOlI0NBQwmDW2USV5rOBW8rkruuADuS8LsbUVQ=",
    "https://www.shutterstock.com/image-vector/give-key-hand-icon-rental-260nw-2051087729.jpg",
  ];

  const handleFileChange = (index, event) => {
    const file = event.target.files?.[0] || null;
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
  };

  const getImagePreviewUrl = (index) => {
    const file = images[index];
    return file ? URL.createObjectURL(file) : DEFAULT_IMAGES[index];
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      toast.success("User added successfully");
      // const response = await fetch("/api/driver/user", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     vehicleNumber,
      //     modeOfTransport,
      //     pickupOrDrop,
      //     images,
      //   }),
      // });
      // const data = await response.json();
      // if (response.status === 201) {
      //   toast.success(data.message);
      // setVehicleNumber("");
      // setModeOfTransport("");
      // setPickupOrDrop("");
      // setImages(Array(6).fill(null));
      console.log(images)
      // } else {
      //   toast.error(data.message);
      // }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen bg-[#0D1F2D]">
      <div className="relative h-full ">
        <div className="z-0 flex justify-between w-full px-4 py-5 text-gray-200 ">
          <div className="">
            <span className="">Welcome back </span>
            <p className="flex mt-1 text-3xl md:text-4xl">
              Salman
              <span className="relative flex w-3 h-3">
                <span className="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping"></span>
                <span className="relative inline-flex w-3 h-3 bg-green-500 rounded-full"></span>
              </span>
            </p>
          </div>
          <div className="text-right ">
            <p className="text-xs md:text-base ">9156822218</p>
            <p className="mb-1 text-xs md:text-base md:mb-2">7142</p>

            <div
              onClick={handleLogout}
              className="flex items-center gap-2 px-2  duration-200 md:border rounded cursor-pointer hover:text-white  py-0.5 select-none md:px-4 bg-[#00668c]  hover:bg-indigo-500"
            >
              <span>Logout</span>
              <IoIosLogOut className="text-xl ml-0.5 lg:text-2xl" />
            </div>
          </div>
        </div>
        <div className="w-full h-full  px-4 py-4 pt-10 bg-[#f5f4f1] md:p-8 rounded-t-2xl   ">
          <div className="w-full">
            <p className="text-2xl ">Start New Drive</p>
            <p className="pb-6 text-sm ">
              Enter vehicle number & mode of travel to start drive.
            </p>
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
              <div className="">
                <label className="block mb-2 " htmlFor="vehicleNumber">
                  Vehicle Number*
                </label>{" "}
                <input
                  className={`appearance-none  w-full py-2.5  leading-tight focus:outline-none focus:shadow-outline bg-none border-b-2 text-sm bg-transparent border-b-black focus:bg-transparent uppercase`}
                  id="vehicleNumber"
                  type="text"
                  required
                  maxLength={14}
                  minLength={6}
                  autoComplete="off"
                  onChange={(e) => setVehicleNumber(e.target.value)}
                  value={vehicleNumber}
                  placeholder="Enter pickup or drop vehicle number"
                />
              </div>
              <div className="relative w-full ">
                <label className="block mb-2 " htmlFor="pickupOrDrop">
                  Select Pickup or Drop*
                </label>
                <select
                  className={` w-full py-2.5 leading-tight focus:outline-none focus:shadow-outline bg-none border-b-2 text-sm bg-transparent border-b-black focus:bg-transparent uppercase `}
                  id="pickupOrDrop"
                  required
                  onChange={(e) => setPickupOrDrop(e.target.value)}
                  value={pickupOrDrop}
                >
                  <option value="" label="" disabled />
                  <option value="Pickup" label="Pickup" />
                  <option value="Drop" label="Drop" />
                </select>
              </div>
              {pickupOrDrop === "Pickup" && (
                <div className="relative ">
                  <label
                    className="block mb-2 text-sm "
                    htmlFor="modeOfTransport"
                  >
                    Transportation Method*
                  </label>
                  <select
                    className={`  w-full py-2.5  leading-tight focus:outline-none focus:shadow-outline bg-none border-b-2 text-sm bg-transparent border-b-black focus:bg-transparent uppercase  `}
                    id="modeOfTransport"
                    onChange={(e) => setModeOfTransport(e.target.value)}
                    value={modeOfTransport}
                    required
                  >
                    <option value="" label="" disabled />
                    <option value="Auto" label="Auto" />
                    <option value="Bike" label="Bike" />
                    <option value="Car" label="Car" />
                    <option value="Bus" label="Bus" />
                    <option value="Metro" label="Metro" />
                    <option value="Train" label="Train" />
                    <option value="Walk" label="Walk" />
                    <option value="Other" label="Other" />
                  </select>
                </div>
              )}

              {pickupOrDrop === "Drop" && (
                <div className="col-span-2 mb-6">
                  <p className="mb-2 ">Upload Vehicle Photo*</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Side view",
                      "Front view",
                      "Back view",
                      "Left side view",
                      "Odometer  ",
                      // "Handover",
                    ].map((label, index) => (
                      <div
                        key={index}
                        className={`relative flex items-center space-x-4 ${
                          index === 0 ? "col-span-2" : ""
                        } `}
                      >
                        <div
                          className={`w-full  flex items-center justify-center border border-gray-300 rounded-lg overflow-hidden ${
                            index === 0 ? "h-40" : "h-32"
                          }`}
                        >
                          <img
                            src={getImagePreviewUrl(index)}
                            alt={label}
                            className="object-cover w-full h-full"
                            // width={100}
                            // height={100}
                          />
                        </div>
                        <div className="absolute top-0 left-0 flex-1 ">
                          {/* <label className="block text-sm font-medium text-gray-700">
                        Click to capture
                        {/* {label} 
                      </label> */}
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              capture="environment" // 'environment' for rear camera, 'user' for front camera
                              onChange={(event) =>
                                handleFileChange(index, event)
                              }
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              required
                            />
                            <button
                              type="button"
                              className="flex items-center justify-center w-full gap-2 px-2 py-3 mt-2 text-xs  bg-[#71c4ef] border rounded-lg "
                            >
                              <FiCamera className="text-xl" />
                              {label}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between col-span-2 pt-">
                <button
                  className={`w-full h-full p-4 text-white  rounded-lg  shadow-black/50 max-w-md mx-auto text-lg text-center ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed "
                      : "bg-[#00668c] shadow-xl"
                  }`}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <p className="flex items-center justify-center gap-2">
                      <span className="">Starting.. </span>
                      <TbLoader3
                        color="white"
                        size={30}
                        className=" animate-spin"
                      />
                    </p>
                  ) : (
                    " Start Drive Now"
                  )}
                </button>
              </div>

              {/* <div className="fixed left-0 z-10 flex justify-center w-full px-4 bottom-4">
                    <button
                      type="submit"
                      disabled={formik.isSubmitting}
                      className={`w-full h-full p-4 text-white bg-[#6C63FF] rounded-lg shadow-xl shadow-black/50 max-w-md mx-auto text-lg text-center`}
                    >
                      Start Drive Now
                    </button>
                  </div> */}
            </form>
          </div>
        </div>
        {/* <div className="fixed bottom-0 left-0 flex items-center justify-between w-full h-16 text-gray-500 rounded-t-xl">
          <div className="flex flex-col items-center justify-center w-1/4 ">
            <HiOutlineHome className="text-3xl text-indigo-600" />
          </div>
          <div className="flex flex-col items-center justify-center w-1/4 ">
            <BiMap className="text-3xl " />
          </div>
          <div className="flex flex-col items-center justify-center w-1/4 ">
            <RiUser6Fill className="text-3xl " />
          </div>
          <div className="flex flex-col items-center justify-center w-1/4 ">
            <IoIosLogOut className="text-3xl " />
          </div>
        </div> */}
      </div>
    </main>
  );
};

export default User;
