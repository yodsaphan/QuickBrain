"use client";
import { CldImage } from "next-cloudinary";
import FirebaseTest from "@/components/firebaseTest";

const page = () => {
  return (
    <div>
      <CldImage
      src="cld-sample-5"
      width={500}
      height={500}
      crop={{ type: "auto", source: true }}
      alt="Cloudinary video"
    ></CldImage>
    <FirebaseTest></FirebaseTest>
    </div>
  );
};

export default page;
