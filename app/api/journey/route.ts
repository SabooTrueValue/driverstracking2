import { connectDB } from "@/dbConfig/dbConfig";
import Driver from "@/models/driverModel";
import Journey from "@/models/modelJourny";
import moment from "moment";
import "moment-timezone";
import mongoose from "mongoose";
moment.tz.setDefault("Asia/Kolkata");
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
connectDB();

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    // await connectDB();
    const data = await req.json();
    // const { phone, password } = reqBody;
    console.log(data);
    if (!data) {
      return NextResponse.json(
        { message: "Reqired fields are missing" },
        { status: 400 }
      );
    }

    const date = moment().format("DD/MM/YYYY");
    const time = moment().format("HH:mm:ss");
    if (!data.employeeId) {
      return NextResponse.json(
        { message: "EmployeeId is missing" },
        { status: 400 }
      );
    }
    data.date = date;
    data.time = time;
    data.location[0].time = time;
    data.location[0].date = date;

    const driverId = cookies().get("_id")?.value;

    //check if user exists
    let saveData = await Journey.create(data);
    console.log(saveData);
    let saveDriver = await Driver.updateOne(
      { _id: driverId },
      { $set: { isDriving: true }, $inc: { totalDrives: 1 } },
      { new: true, upsert: true }
    );

    if (!saveData || !saveDriver) {
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });
    }

    //check if password is correct
    const cookieString = `journeyId=${saveData._id}`;

    return NextResponse.json(
      {
        status: true,
        data: saveData,
        profile: saveDriver,
        message: "Journey created successfully",
      },
      {
        status: 201,
        headers: {
          "Set-Cookie": cookieString,
        },
      }
    );
  } catch (err: any) {
    console.error(err.message);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    console.log(data);

    if (!data || !data.location) {
      return NextResponse.json(
        { message: "Required fields are missing" },
        { status: 400 }
      );
    }

    const date = moment().format("DD/MM/YYYY");
    const time = moment().format("HH:mm:ss");

    let journeyId = cookies().get("journeyId")?.value;
    if (!journeyId) {
      journeyId = data.journeyId;
    }
    if (!journeyId) {
      return NextResponse.json(
        { message: "JourneyId is missing" },
        { status: 400 }
      );
    }

    const { formattedLocation, lat, lng } = data.location;

    if (!formattedLocation || !lat || !lng) {
      return NextResponse.json(
        { message: "Location fields are missing" },
        { status: 400 }
      );
    }

    const locationData = {
      time,
      date,
      formattedLocation,
      lat,
      lng,
      detail: data.location.detail || "Driving to destination",
    };

    // Determine the update operation based on location detail
    // const update = {}
    // if (data?.modeOfTransport){

    // }
    if (data?.modeOfTransport) {
      const update = {
        $push: {
          location: locationData,
          ...(data.image ? { images: data.image } : {}), // Only push images if they exist
        },
        $set: {
          status: data.location.detail,
          modeOfTransport: data.modeOfTransport,
        },
      };

      const updatedJourney = await Journey.findOneAndUpdate(
        { _id: journeyId },
        update,
        { new: true }
      );

      if (data.location.detail === "Drive Ended") {
        const driverId = cookies().get("_id")?.value;

        await Driver.updateOne(
          { _id: driverId },
          { $set: { isDriving: false } },
          { new: true, upsert: true }
        );
      }

      if (!updatedJourney) {
        return NextResponse.json(
          { message: "Journey not found" },
          { status: 404 } // Changed status to 404 as it's more appropriate for not found
        );
      }

      return NextResponse.json(
        {
          status: true,
          data: updatedJourney,
          message: "Journey updated successfully",
        },
        { status: 200 } // Changed status to 200 for successful update
      );
    } else {
      const update = {
        $push: {
          location: locationData,
          ...(data.image ? { images: data.image } : {}), // Only push images if they exist
        },
        $set: {
          status: data.location.detail,
        },
      };

      const updatedJourney = await Journey.findOneAndUpdate(
        { _id: journeyId },
        update,
        { new: true }
      );

      if (data.location.detail === "Drive Ended") {
        const driverId = cookies().get("_id")?.value;

        await Driver.updateOne(
          { _id: driverId },
          { $set: { isDriving: false } },
          { new: true, upsert: true }
        );
      }

      if (!updatedJourney) {
        return NextResponse.json(
          { message: "Journey not found" },
          { status: 404 } // Changed status to 404 as it's more appropriate for not found
        );
      }

      return NextResponse.json(
        {
          status: true,
          data: updatedJourney,
          message: "Journey updated successfully",
        },
        { status: 200 } // Changed status to 200 for successful update
      );
    }
  } catch (err: any) {
    console.error(err.message);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    interface Values {
      _id?: string | mongoose.Types.ObjectId;
      isDeleted: boolean;
    }
    // Initialize filter to find non-deleted users
    let filter: Values = { isDeleted: false };

    // Extract query parameters from req.url
    // const queryParams = new URLSearchParams(req.url.split("?")[1]);
    const driverId = cookies().get("_id")?.value;

    // Check if driverId query parameter is provided
    if (driverId) {
      filter._id = driverId;
    }

    // Query database for users based on filter

    // Check if users are found

    const journeyData = await Journey.find({ driversId: driverId })
      .sort({
        createdAt: -1,
      })
      .limit(5);

    console.log(journeyData);

    // Return users with success status
    return NextResponse.json(
      { data: journeyData, message: "success" },
      { status: 200 }
    );
  } catch (error) {
    // Handle any errors that occur during database query or processing
    console.error("Error in GET request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
