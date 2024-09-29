import { Toaster as Sonner } from "sonner";

const Toaster = ({ ...props }) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          // Toast background and border styling
          toast:
            "group toast group-[.toaster]:bg-[#2a2b33] group-[.toaster]:text-[#e0e0e0] group-[.toaster]:border-[#3b3c47] group-[.toaster]:shadow-lg",

          // Description text color
          description: "group-[.toast]:text-[#a8a9b1]",

          // Action button styling (for confirming or interacting with toasts)
          actionButton:
            "group-[.toast]:bg-[#8417ff] group-[.toast]:text-white hover:bg-[#741bda] transition-all",

          // Cancel button styling (if any)
          cancelButton:
            "group-[.toast]:bg-[#3b3c47] group-[.toast]:text-[#a8a9b1] hover:bg-[#525260] transition-all",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
