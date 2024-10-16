"use client";
import React, { useState } from "react";
import { IoIosLogOut } from "react-icons/io";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { TbLoader3 } from "react-icons/tb";
import { FiCamera } from "react-icons/fi";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
// import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { FirebaseStorage } from "@/lib/firebase";
import axios from "axios";
import { useAppContext } from "@/context";
import imageCompression from "browser-image-compression";
// import { FirebaseStorage, FirebaseStore } from "@/lib/firebase";

const User = () => {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState(Array(5).fill(null));
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [modeOfTransport, setModeOfTransport] = useState("");
  const [pickupOrDrop, setPickupOrDrop] = useState("");
  // const [finalImage, setFinalImage] = useState(null);

  const {
    driverData,
    setDriverData,
    journyData,
    // setJournyData,
    isDriving,
    setIsDriving,
    getDriverData,
    journeyData,
  } = useAppContext();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("driverId");
    Cookies.remove("_id");
    Cookies.remove("journeyId");
    toast.success("Logout Successfully");
    window.location.href = "/login";
  };

  const DEFAULT_IMAGES = [
    "/Front view.webp",
    "/right side view.webp",
    "/back view.webp",
    "/left side view.webp",
    "/odometer.webp",
  ];

  const convertTo12HourFormat = (time24) => {
    const [hours, minutes] = time24.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12; // Convert 0 hours to 12
    return `${hours12}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const compressImage = async (file) => {
    const options = {
      maxSizeMB: 0.5, // Max size of the file in MB (500KB)
      maxWidthOrHeight: 1920, // Resize image to width/height if necessary
      useWebWorker: true, // Speed up compression
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return compressedFile;
    } catch (error) {
      console.log("Error while compressing the image", error);
      throw error;
    }
  };
  
const handleFileChange = async (index, event) => {
  const file = event.target.files?.[0] || null;

  if (file) {
    try {
      const compressedFile = await compressImage(file);
      const newImages = [...images];
      newImages[index] = compressedFile; // Use the compressed file
      setImages(newImages);
    } catch (error) {
      console.error("Error compressing the image", error);
    }
  } else {
    console.log("No file selected");
  }
};

  const getImagePreviewUrl = (index) => {
    const file = images[index];
    return file ? URL.createObjectURL(file) : DEFAULT_IMAGES[index];
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (pickupOrDrop === "Drop") {
        const imageUrls = [];

        const uploadPromises = images.map(async (file, index) => {
          if (!file) return;
          const storageRef = ref(
            FirebaseStorage,
            `journeys/${vehicleNumber.toUpperCase()}/${Date.now()}-${index}`
          );

          const snapshot = await uploadBytes(storageRef, file);
          const url = await getDownloadURL(snapshot.ref);
          // console.log(url);
          imageUrls.push(url);
        });

        await Promise.all(uploadPromises);
        handleWithoutPermission({
          vehicleNumber: vehicleNumber,
          modeOfTransport: modeOfTransport,
          type: "Start",
          detail: "Starting trip",
          images: imageUrls,
        });
      } else {
        handleWithoutPermission({
          vehicleNumber: vehicleNumber,
          modeOfTransport: modeOfTransport,
          type: "Start",
          detail: "Starting trip",
        });

        console.log(vehicleNumber, modeOfTransport, pickupOrDrop);
      }
      // await addDoc(collection(FirebaseStore, "journeys"), {
      //   vehicleNumber,
      //   modeOfTransport,
      //   pickupOrDrop,
      //   images: imageUrls,
      //   createdAt: serverTimestamp(),
      // });

      toast.success("Drive started successfully");
      setVehicleNumber("");
      setModeOfTransport("");
      setPickupOrDrop("");
      setImages(Array(5).fill(null));
      // console.log(imageUrls);
    } catch (error) {
      console.error(error);
      toast.error("Failed to start drive");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit2 = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const imageUrls = [];
      const uploadPromises = images.map(async (file, index) => {
        if (!file) return;

        const storageRef = ref(
          FirebaseStorage,
          `journeys/${journyData[0]?.vehicleNumber?.toUpperCase()}/${Date.now()}-${index}`
        );

        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        // console.log(url);
        imageUrls.push(url);
      });

      await Promise.all(uploadPromises);

      handleWithoutPermission({
        type: "Update",
        detail: "Dropped",
        images: imageUrls,
      });
      toast.success("Drive started successfully");

      // await addDoc(collection(FirebaseStore, "journeys"), {
      //   vehicleNumber,
      //   modeOfTransport,
      //   pickupOrDrop,
      //   images: imageUrls,
      //   createdAt: serverTimestamp(),
      // });

      setVehicleNumber("");
      setModeOfTransport("");
      setPickupOrDrop("");
      setImages(Array(5).fill(null));
      // console.log(imageUrls);
    } catch (error) {
      console.error(error);
      toast.error("Failed to start drive");
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit3 = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const imageUrls = [];
      const uploadPromises = images.map(async (file, index) => {
        if (!file) return;

        const storageRef = ref(
          FirebaseStorage,
          `journeys/${journyData[0]?.vehicleNumber?.toUpperCase()}/${Date.now()}-${index}`
        );

        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        // console.log(url);
        imageUrls.push(url);
      });

      await Promise.all(uploadPromises);

      handleWithoutPermission({
        type: "Update",
        detail: "Picked up",
        images: imageUrls,
      });
      toast.success("Drive started successfully");

      // await addDoc(collection(FirebaseStore, "journeys"), {
      //   vehicleNumber,
      //   modeOfTransport,
      //   pickupOrDrop,
      //   images: imageUrls,
      //   createdAt: serverTimestamp(),
      // });

      setVehicleNumber("");
      setModeOfTransport("");
      setPickupOrDrop("");
      setImages(Array(5).fill(null));
      // console.log(imageUrls);
    } catch (error) {
      console.error(error);
      toast.error("Failed to start drive");
    } finally {
      setLoading(false);
    }
  };
  const handleSubmit4 = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const imageUrls = [];
      const uploadPromises = images.map(async (file, index) => {
        if (!file) return;

        const storageRef = ref(
          FirebaseStorage,
          `journeys/${journyData[0]?.vehicleNumber?.toUpperCase()}/${Date.now()}-${index}`
        );

        const snapshot = await uploadBytes(storageRef, file);
        const url = await getDownloadURL(snapshot.ref);
        // console.log(url);
        imageUrls.push(url);
      });

      await Promise.all(uploadPromises);

      handleWithoutPermission({
        type: "Update",
        detail: "Reached to showroom",
        images: imageUrls,
      });
      toast.success("Drive started successfully");

      // await addDoc(collection(FirebaseStore, "journeys"), {
      //   vehicleNumber,
      //   modeOfTransport,
      //   pickupOrDrop,
      //   images: imageUrls,
      //   createdAt: serverTimestamp(),
      // });

      setVehicleNumber("");
      setModeOfTransport("");
      setPickupOrDrop("");
      setImages(Array(5).fill(null));
      // console.log(imageUrls);
    } catch (error) {
      console.error(error);
      toast.error("Failed to start drive");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit5 = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      handleWithoutPermission({
        type: "Update",
        detail: "Drive Ended",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to start drive");
    } finally {
      setLoading(false);
    }
  };

  const handleWithoutPermission = async ({
    vehicleNumber,
    modeOfTransport,
    type,
    detail,
    images,
  }) => {
    setLoading(true);

    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            // console.log("Geolocation position:", position);

            try {
              const addressData = await getCurrentAddress(latitude, longitude);
              const formattedLocation =
                addressData?.results[0]?.formatted || "";

              const now = new Date();
              const locationData = {
                formattedLocation,
                lat: latitude,
                lng: longitude,
                detail,
                time: now.toLocaleTimeString(),
                date: now.toLocaleDateString(),
              };
              if (type === "Update") {
                updateJourney({ ...locationData, images, detail });
              } else if (type === "Start" && pickupOrDrop === "Drop") {
                startJourney({
                  ...locationData,
                  vehicleNumber,
                  modeOfTransport,
                  images,
                });
              } else if (type === "Start" && pickupOrDrop === "Pickup") {
                startJourney({
                  ...locationData,
                  vehicleNumber,
                  modeOfTransport,
                });
              }
              //  else if (type === "End") {
              //   endJourney(locationData);
              // }
            } catch (error) {
              console.error("Error fetching address:", error);
            }
          },
          async (error) => {
            console.error("Geolocation error:", error);

            try {
              // Fallback to IP-based geolocation
              const ipAdd = await axios.get("https://ipapi.co/json/");
              const addressData = await getCurrentAddress(
                ipAdd.data.latitude,
                ipAdd.data.longitude
              );

              const formattedLocation =
                addressData?.results[0]?.formatted || "";

              const now = new Date();
              const locationData = {
                formattedLocation,
                lat: ipAdd.data.latitude,
                lng: ipAdd.data.longitude,
                detail,
                time: now.toLocaleTimeString(),
                date: now.toLocaleDateString(),
              };

              if (type === "Update") {
                updateJourney({ ...locationData, images, detail });
              } else if (type === "Start" && pickupOrDrop === "Drop") {
                startJourney({
                  ...locationData,
                  vehicleNumber,
                  modeOfTransport,
                  images,
                });
              } else if (type === "Start" && pickupOrDrop === "Pickup") {
                startJourney({
                  ...locationData,
                  vehicleNumber,
                  modeOfTransport,
                });
              }
              // else if (type === "End") {
              //   endJourney(locationData);
              // }
            } catch (ipError) {
              console.error("Error fetching IP-based geolocation:", ipError);
            }
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    } catch (error) {
      console.error("Error handling without permission:", error);
    } finally {
      setLoading(false);
    }
  };

  const startJourney = async ({
    formattedLocation,
    lat,
    lng,
    vehicleNumber,
    modeOfTransport,
    detail,
    images,
  }) => {
    // Check if driverData exists
    setLoading(true);
    // if (!driverData) {
    //   toast.error("Driver data not found. Please try again later.");
    //   console.error("Driver data is null or undefined.");

    //   window.location.href = "/login";
    //   return;
    // }

    try {
      if (pickupOrDrop === "Drop") {
        const response = await axios.post("/api/journey", {
          driversId: driverData._id,
          employeeId: driverData.employeeId,
          driverName: driverData.name,
          driverPhone: driverData.phone,
          journeyType: pickupOrDrop,
          images: images,

          vehicleNumber: vehicleNumber?.toUpperCase(),
          modeOfTransport: modeOfTransport,
          status: "Drive Started",
          location: [
            {
              formattedLocation,
              lat,
              lng,
              detail: "Drive Started",
            },
          ],
        });

        console.log("API response:", response);

        if (response.data.status === true) {
          toast.success("Journey started successfully.");
        } else {
          toast.error("Failed to start journey. Please try again later.");
        }
      } else {
        const response = await axios.post("/api/journey", {
          driversId: driverData._id,
          employeeId: driverData.employeeId,
          driverName: driverData.name,
          driverPhone: driverData.phone,
          journeyType: pickupOrDrop,

          vehicleNumber: vehicleNumber?.toUpperCase(),
          modeOfTransport: modeOfTransport,
          status: "Drive Started",
          location: [
            {
              formattedLocation,
              lat,
              lng,
              detail: "Drive Started",
            },
          ],
        });

        console.log("API response:", response);

        if (response.data.status === true) {
          toast.success("Journey started successfully.");
        } else {
          toast.error("Failed to start journey. Please try again later.");
        }
      }

      setDriverData({
        ...driverData,
        isDriving: true,
      });

      getDriverData();
      journeyData();

      setIsDriving(true);

      // localStorage.setItem("journeyId", response?.data?.data._id);
    } catch (error) {
      toast.error("Failed to start journey. Please try again later.");
      console.error("Error starting journey:", error);
    } finally {
      setLoading(false);
    }
  };
 
  const updateJourney = async ({
    formattedLocation,
    lat,
    lng,
    detail,
    images,
  }) => {
    setLoading(true);

    try {
      if (detail === "Drive Ended") {
        const response = await axios.put(`/api/journey`, {
          status: detail,
          modeOfTransport: modeOfTransport,
          location: {
            formattedLocation,
            lat,
            lng,
            detail,
          },
          journeyId: journyData[0]?._id,
        });
        console.log("API response:", response);

        if (response.data.status === true) {
          toast.success("Driving status updated successfully.");

          getDriverData();
          journeyData();
        } else {
          toast.error("Failed to update journey. Please try again later.");
        }
      } else if (detail === "Reached to showroom") {
        toast.success("Reached to showroom.");
        const response = await axios.put(`/api/journey`, {
          status: detail,
          image: images?.length > 1 ? images : images[0],
          location: {
            formattedLocation,
            lat,
            lng,
            detail: "Drive Ended",
          },
          journeyId: journyData[0]?._id,
          pickupCompleted: true,
        });
        console.log("API response:", response);

        if (response.data.status === true) {
          toast.success("Driving status updated successfully.");

          getDriverData();
          journeyData();
        } else {
          toast.error("Failed to update journey. Please try again later.");
        }
      } else {
        toast.success("Testing2");
        console.log(images);
        const response = await axios.put(`/api/journey`, {
          status: detail,
          image: images?.length > 1 ? images : images[0],
          location: {
            formattedLocation,
            lat,
            lng,
            detail,
          },
          journeyId: journyData[0]?._id,
        });
        console.log("API response:", response);

        if (response.data.status === true) {
          toast.success("Driving status updated successfully.");

          getDriverData();
          journeyData();
        } else {
          toast.error("Failed to update journey. Please try again later.");
        }
      }
    } catch (error) {
      toast.error("Failed to update journey. Please try again later.");
      console.error("Error while updating journey:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentAddress = async (lat, lng) => {
    setLoading(true);
    const apiEndpoint = "https://api.opencagedata.com/geocode/v1/json?";
    const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;

    if (!apiKey) {
      console.error(
        "OpenCage API key is missing. Please add it to your .env file."
      );
      return null;
    }

    const url = `${apiEndpoint}key=${apiKey}&q=${lat},${lng}&pretty=1&no_annotations=1`;

    try {
      const response = await axios.get(url);
      console.log("Geocoding response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching address:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen bg-[#6C63FF]">
      <div className="relative h-full">
        <div className="z-0 flex justify-between w-full px-4 py-5 text-gray-200 min-h-24">
          <div className="">
            <span className="">Welcome back </span>
            <p className="flex mt-1 text-3xl md:text-4xl">
              {driverData?.name}{" "}
              {isDriving && (
                <span className="relative flex w-3 h-3">
                  <span className="absolute inline-flex w-full h-full bg-green-400 rounded-full opacity-75 animate-ping"></span>
                  <span className="relative inline-flex w-3 h-3 bg-green-500 rounded-full"></span>
                </span>
              )}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs md:text-base ">{driverData?.phone}</p>
            <p className="mb-1 text-xs md:text-base md:mb-2">
              {driverData?.employeeId}
            </p>

            <div
              onClick={handleLogout}
              className="flex items-center gap-2 px-2 duration-200 md:border rounded cursor-pointer hover:text-white py-0.5 select-none md:px-4 bg-[#6C63FF] hover:bg-indigo-500 border"
            >
              <span>Logout</span>
              <IoIosLogOut className="text-xl ml-0.5 lg:text-2xl" />
            </div>
          </div>
        </div>
        <div className="w-full h-full px-4 py-4 pt-10 bg-[#f5f4f1] md:p-8 rounded-t-2xl min-h-[calc(100vh-64px)]">
          {!isDriving ? (
            <div className="w-full">
              <p className="text-2xl font-bold">
                కొత్త డ్రైవ్‌ను ప్రారంభించండి
              </p>
              <p className="pb-2 text-sm">
                డ్రైవింగ్ ప్రారంభించడానికి వాహనం నంబర్ & ప్రయాణ విధానాన్ని నమోదు
                చేయండి.
              </p>
              <p className="text-xl">Start New Drive</p>
              <p className="pb-6 text-sm">
                Enter vehicle number & mode of travel to start drive.
              </p>
              <form
                onSubmit={handleSubmit}
                className="w-full max-w-md space-y-6"
              >
                <div>
                  <label
                    className="block mb-2 text-[#6C63FF] font-bold"
                    htmlFor="vehicleNumber"
                  >
                    కారు నంబర్ <br /> Vehicle Number*
                  </label>
                  <input
                    className="appearance-none w-full py-2.5 leading-tight focus:outline-none focus:shadow-outline bg-none border-b-2 text-sm bg-transparent border-b-black focus:bg-transparent uppercase"
                    id="vehicleNumber"
                    type="text"
                    required
                    maxLength={14}
                    autoFocus
                    minLength={6}
                    autoComplete="off"
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    value={vehicleNumber}
                    placeholder="Enter pickup or drop vehicle number"
                  />
                </div>
                <div className="relative w-full">
                  <label
                    className="block mb-2 text-[#6C63FF] font-bold"
                    htmlFor="pickupOrDrop"
                  >
                    పికప్ లేదా డ్రాప్ ఎంచుకోండి <br /> Select Pickup or Drop*
                  </label>
                  <select
                    className="w-full py-2.5 leading-tight focus:outline-none focus:shadow-outline bg-none border-b-2 text-sm bg-transparent border-b-black focus:bg-transparent uppercase "
                    id="pickupOrDrop"
                    required
                    onChange={(e) => setPickupOrDrop(e.target.value)}
                    value={pickupOrDrop}
                  >
                    <option value="" label="" disabled />
                    <option
                      value="Pickup"
                      label="పికప్ Pickup "
                      className="font-bold"
                    />
                    <option
                      value="Drop"
                      label="డ్రాప్ Drop"
                      className="font-bold"
                    />
                  </select>
                </div>
                {pickupOrDrop === "Pickup" && (
                  <div className="relative">
                    <label
                      className="block mb-2 text-[#6C63FF] font-bold"
                      htmlFor="modeOfTransport"
                    >
                      ఎలా వెళ్తున్నారు <br /> Transportation Method*
                    </label>
                    <select
                      className="w-full py-2.5 leading-tight focus:outline-none focus:shadow-outline bg-none border-b-2 text-sm bg-transparent border-b-black focus:bg-transparent uppercase"
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
                    <p className="font-bold">కార్ ఫోటోను అప్‌లోడ్ చేయండి**</p>
                    <p className="mb-2 text-[#6C63FF]">Upload Vehicle Photo*</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "Front view",
                        "Right Side view",
                        "Back view",
                        "Left side view",
                        "Odometer",
                      ].map((label, index) => (
                        <div
                          key={index}
                          className={`relative flex items-center space-x-4 ${
                            index === 0 ? "col-span-2" : ""
                          }`}
                        >
                          <div
                            className={`w-full flex items-center justify-center border border-gray-300 rounded-lg overflow-hidden ${
                              index === 0 ? "h-40" : "h-32"
                            }`}
                          >
                            <img
                              src={getImagePreviewUrl(index)}
                              alt={label}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="absolute top-0 left-0 w-full h-full">
                            <div className="relative w-full h-full ">
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
                                className="flex items-center justify-center w-min gap-2 px-2 py-3 mt-2 text-xs bg-[#6b63ff] border rounded-lg text-white "
                              >
                                <FiCamera className="text-xl" />
                                {/* {label} */}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between w-full col-span-2 px-4 ">
                  {driverData?.name?.length > 0 && (
                    <button
                      className={`w-full h-full p-2.5 text-white rounded-lg shadow-black/50 max-w-md mx-auto text-lg text-center ${
                        loading
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-700 shadow-xl"
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
                            className="animate-spin"
                          />
                        </p>
                      ) : (
                        <>
                          <p>డ్రైవ్ ని ప్రారంభించండి</p>
                          <p> Start Drive Now</p>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : isDriving &&
            journyData[0]?.status === "Drive Started" &&
            journyData[0]?.journeyType === "Drop" ? (
            <div className="w-full">
              {/* <p className="pb-2 text-xl text-indigo-500">
                Ongoing {journyData[0]?.journeyType} Journey For,
              </p> */}
              <p className="pb-2 text-2xl ">{journyData[0]?.vehicleNumber}</p>
              <form
                onSubmit={handleSubmit2}
                className="w-full max-w-md space-y-6"
              >
                <div className="col-span-2 mb-6">
                  <p className="font-bold">కార్ ఫోటోను అప్‌లోడ్ చేయండి**</p>
                  <p className="mb-2 text-[#6C63FF]">Upload Vehicle Photo*</p>
                  <div className="grid grid-cols-2 gap-2">
                    {["Final delivery to the customer"].map((label, index) => (
                      <div
                        key={index}
                        className={`relative flex items-center space-x-4 ${
                          index === 0 ? "col-span-2" : ""
                        }`}
                      >
                        <div
                          className={`w-full flex items-center justify-center border border-gray-300 rounded-lg overflow-hidden max-w-xl`}
                        >
                          <img
                            src={getImagePreviewUrl(index)}
                            alt={label}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="absolute top-0 left-0 flex-1">
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
                              className="flex items-center justify-center w-full gap-2 px-2 py-3 mt-2 text-xs bg-[#6C63FF] border rounded-lg text-gray-200"
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

                <div className="flex items-center justify-between w-full col-span-2 px-4 ">
                  <button
                    className={`w-full h-full p-2.5 text-white rounded-lg shadow-black/50 max-w-md mx-auto text-lg text-center ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-700 shadow-xl"
                    }`}
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <p className="flex items-center justify-center gap-2">
                        <span className="">Droping.. </span>
                        <TbLoader3
                          color="white"
                          size={30}
                          className="animate-spin"
                        />
                      </p>
                    ) : (
                      <>
                        <p>ఇప్పుడు అప్పగించండి</p>
                        <p> Handover Now</p>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : isDriving &&
            journyData[0]?.status === "Drive Started" &&
            journyData[0]?.journeyType === "Pickup" ? (
            <div className="w-full">
              {/* <p className="pb-2 text-xl text-indigo-500">
                Ongoing {journyData[0]?.journeyType} Journey For,
              </p> */}
              <p className="pb-2 text-2xl ">{journyData[0]?.vehicleNumber}</p>
              <form
                onSubmit={handleSubmit3}
                className="w-full max-w-md space-y-6"
              >
                <div className="col-span-2 mb-6">
                  <p className="font-bold">కార్ ఫోటోను అప్‌లోడ్ చేయండి**</p>
                  <p className="mb-2 text-[#6C63FF]">Upload Vehicle Photo*</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "Front view",
                      "Right Side view",
                      "Back view",
                      "Left side view",
                      "Odometer",
                    ].map((label, index) => (
                      <div
                        key={index}
                        className={`relative flex items-center space-x-4 ${
                          index === 0 ? "col-span-2" : ""
                        }`}
                      >
                        <div
                          className={`w-full flex items-center justify-center border border-gray-300 rounded-lg overflow-hidden ${
                            index === 0 ? "h-40" : "h-32"
                          }`}
                        >
                          <img
                            src={getImagePreviewUrl(index)}
                            alt={label}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="absolute top-0 left-0 w-full h-full">
                          <div className="relative w-full h-full ">
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
                              className="flex items-center justify-center w-min gap-2 px-2 py-3 mt-2 text-xs bg-[#6b63ff] border rounded-lg text-white "
                            >
                              <FiCamera className="text-xl" />
                              {/* {label} */}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between w-full col-span-2 px-4 ">
                  <button
                    className={`w-full h-full p-2.5 text-white rounded-lg shadow-black/50 max-w-md mx-auto text-lg text-center ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-700 shadow-xl"
                    }`}
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <p className="flex items-center justify-center gap-2">
                        <span className="">Picking up.. </span>
                        <TbLoader3
                          color="white"
                          size={30}
                          className="animate-spin"
                        />
                      </p>
                    ) : (
                      "Pickup Now"
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : isDriving &&
            journyData[0]?.status === "Picked up" &&
            journyData[0]?.journeyType === "Pickup" ? (
            <div className="w-full">
              {/* <p className="pb-2 text-xl text-indigo-500">
                End the {journyData[0]?.journeyType} Journey For,
              </p> */}
              <p className="pb-2 text-2xl ">{journyData[0]?.vehicleNumber}</p>
              <form
                onSubmit={handleSubmit4}
                className="w-full max-w-md space-y-6"
              >
                <div className="col-span-2 mb-6">
                  <p className="font-bold">కార్ ఫోటోను అప్‌లోడ్ చేయండి**</p>
                  <p className="mb-2 text-[#6C63FF]">Upload Vehicle Photo*</p>
                  <div className="grid grid-cols-2 gap-2">
                    {["Final delivery to serivce center"].map(
                      (label, index) => (
                        <div
                          key={index}
                          className={`relative flex items-center space-x-4 ${
                            index === 0 ? "col-span-2" : ""
                          }`}
                        >
                          <div
                            className={`w-full flex items-center justify-center border border-gray-300 rounded-lg overflow-hidden max-w-xl`}
                          >
                            <img
                              src={getImagePreviewUrl(index)}
                              alt={label}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="absolute top-0 left-0 flex-1">
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
                                className="flex items-center justify-center w-full gap-2 px-2 py-3 mt-2 text-xs bg-[#6C63FF] border rounded-lg text-gray-200"
                              >
                                <FiCamera className="text-xl" />
                                {label}
                              </button>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between w-full col-span-2 px-4 ">
                  <button
                    className={`w-full h-full p-2.5 text-white rounded-lg shadow-black/50 max-w-md mx-auto text-lg text-center ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-red-700 shadow-xl"
                    }`}
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <p className="flex items-center justify-center gap-2">
                        <span className="">Ending.. </span>
                        <TbLoader3
                          color="white"
                          size={30}
                          className="animate-spin"
                        />
                      </p>
                    ) : (
                      "End Now"
                    )}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="w-full">
              <p className="pb-2 text-xl text-indigo-500">
                Drive completed for
              </p>
              <p className="pb-2 text-2xl ">{journyData[0]?.vehicleNumber}</p>

              <form
                onSubmit={handleSubmit5}
                className="w-full max-w-md space-y-6"
              >
                <div className="relative">
                  <label
                    className="block mb-2 text-sm text-[#6C63FF]"
                    htmlFor="modeOfTransport"
                  >
                    Transportation Method*
                  </label>
                  <select
                    className="w-full py-2.5 leading-tight focus:outline-none focus:shadow-outline bg-none border-b-2 text-sm bg-transparent border-b-black focus:bg-transparent uppercase"
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
                </div>{" "}
                <div className="z-10 flex w-full gap-4 px-4 bottom-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full h-full p-3 text-white  rounded-lg  shadow-black/50 max-w-md  text-lg  ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed "
                        : "bg-red-500 shadow-xl"
                    }`}
                  >
                    {loading ? (
                      <p className="flex items-center justify-center gap-2">
                        <span className="">Ending.. </span>
                        <TbLoader3
                          color="white"
                          size={30}
                          className=" animate-spin"
                        />
                      </p>
                    ) : (
                      "Drive Ended"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className={`${!isDriving ? " mt-20" : " mt-8  "} pb-20 mb-10`}>
            <p className="pb-2 text-xl text-indigo-500 ">
              Drives History{" "}
              <span className="text-xs text-gray-500 ">( last 5 )</span>
            </p>

            {journyData?.length > 0 ? (
              <div className="flex flex-col gap-4 pt-4 md:flex-wrap md:flex-row ">
                {journyData?.map((journey, index) => (
                  <div
                    key={index}
                    className="max-h-[50vh] p-4  bg-white border rounded-lg shadow-sm shadow-black/50 relative max-w-sm"
                  >
                    <div className="flex justify-between py-2 mb-5 bg-white border-b md:flex-row">
                      <p className="text-indigo-500 ">
                        {journey?.vehicleNumber}
                      </p>

                      <p className="text-sm text-indigo-500">
                        {/* <strong>Date:</strong>{" "}  */}
                        {journey.date}
                      </p>
                    </div>

                    {journey.location.map((loc, index) => (
                      <div key={index} className="flex gap-1 -mt-1 ">
                        <div className="flex flex-col items-center justify-start w-4 pt-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              index === 0
                                ? "bg-green-500"
                                : index === 1
                                ? "bg-blue-500"
                                : "bg-red-500"
                            }`}
                          />
                          {index < 2 && (
                            <div className="w-1 h-full border-r-2 border-r-indigo-500 border-dashed -ml-0.5 " />
                          )}
                        </div>
                        <div className="">
                          <p className="text-indigo-500">
                            {loc?.detail} -{" "}
                            {loc?.time ? convertTo12HourFormat(loc.time) : ""}
                          </p>
                          <p className="pb-3 text-xs">
                            {loc.formattedLocation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No recent drive history.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default User;
