import React from "react";
import { Toaster } from "sonner";

const CustomToaster = () => {
  return (
    <Toaster
      theme="dark"
      richColors
      toastOptions={{
        // unstyled:true,
        classNames: {
          title: "font-bold text-base",
          description: "font-light text-sm ",
          toast: "bg-gray-900 border-gray-700 w-full p-3 rounded-lg shadow-2xl !border font-sans",
          success: "!text-emerald-500 !border-emerald-500 !bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-400/10",
          error: "!text-rose-400 !border-rose-500 !bg-gradient-to-br from-gray-900 via-gray-900 to-rose-400/10",
          warning: "!text-amber-400 !border-amber-500 !bg-gradient-to-br from-gray-900 via-gray-900 to-amber-400/10",
          info: "!text-cyan-400 !border-cyan-500 !bg-gradient-to-br from-gray-900 via-gray-900 to-cyan-400/10",
        },
      }}
    />
  );
};

export default CustomToaster;
