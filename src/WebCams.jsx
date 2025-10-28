import React, { useEffect, useState } from "react";
import "./CSS/Spinner.css";
import stations from "./stations.json";
import { BsX } from "react-icons/bs";

function WebCams({ showWebcam }) {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    console.log(stations);
  }, []);

  return (
    <>
      <div className="h-full w-full bg-white text-black box-border p-0 overflow-auto relative">
        {/* Sticky Close Button */}
        <h1 className="mt-4 ml-4 text-xl font-semibold text-center">Webcams</h1>
        <div className="sticky top-0 z-10 p-4">
          <button
            onClick={() => showWebcam(false)}
            className="h-10 w-10 flex items-center justify-center rounded-md bg-red-400 ml-auto"
          >
            <BsX className="text-white" size={20} />
          </button>
        </div>

        {/* Responsive Grid */}
        <div className="p-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {stations &&
            stations.map((e, index) => (
              <div
                key={index}
                className="relative bg-gray-50 aspect-square w-full rounded-md overflow-hidden cursor-pointer hover:shadow-lg transition"
                onClick={() => setSelectedImage(e)}
              >
                <img
                  src={e.url}
                  alt={e.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 w-full text-center p-2 text-sm font-medium">
                <div className="mx-auto w-fit bg-white p-1 px-2 rounded-md">
                  {e.name}
                </div>
                </div>
              </div>
            ))}
        </div>

        {/* Overlay Modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="relative bg-white rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh]">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 z-10 bg-white p-2 rounded-full shadow-md"
              >
                <BsX size={24} />
              </button>
              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                className="w-full h-full object-contain"
              />
              <div className="p-4 text-center text-lg font-semibold">
                {selectedImage.name}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default WebCams;
