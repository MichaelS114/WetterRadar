import React from "react";
import "./CSS/Spinner.css";

function Spinner() {

  return (
    <>
      <div id="Spinner" className="absolute h-full w-full flex justify-center items-center z-[1000] bg-black/30">
        <div className="flex w-40 h-40 bg-white rounded-2xl shadow-2xl items-center justify-center border-gray-200 border-[1px]">
          <svg className="animate-spin h-8 w-8 text-blue-700" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-100" cx="12" cy="12" r="10" stroke="#bae6fd" strokeWidth="4"></circle>
            <path className="opacity-100" fill="#0369a1" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    </>
  )
}

export default Spinner;
