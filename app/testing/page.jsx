"use client";
import React from "react";
import { handleFormSubmit } from "./actions";
import { useFormState } from "react-dom";
// import { uploadFileToS3 } from "@/lib/aws";
const Page = () => {
  const [state, formAction] = useFormState(handleFormSubmit, null);
  return (
    <div>
      <h1>Upload Images</h1>
      <form action={formAction} className="file-upload-form">
        <label htmlFor="my-file">Select a file and upload</label>
        <input type="file" name="my-file" id="my-file" />
        <button className="submit">Upload</button>
      </form>
      {state && state.message && (
        <div className="bg-teal-500">{state.message}</div>
      )}
    </div>
  );
};

export default Page;
