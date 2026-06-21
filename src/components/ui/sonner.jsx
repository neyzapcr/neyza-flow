import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner";
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4 text-green-600" />
        ),
        info: (
          <InfoIcon className="size-4 text-blue-600" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4 text-yellow-600" />
        ),
        error: (
          <OctagonXIcon className="size-4 text-red-600" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin text-gray-500" />
        ),
      }}
      toastOptions={{
        classNames: {
          toast: "cn-toast border border-gray-150 rounded-2xl shadow-xl p-4 font-Montserrat flex gap-3 items-start bg-white text-gray-800",
          title: "text-xs font-bold text-gray-800",
          description: "text-[11px] text-gray-500 font-medium mt-0.5",
          success: "!bg-green-50/80 !border-green-100 !text-green-900",
          error: "!bg-red-50/80 !border-red-100 !text-red-900",
          warning: "!bg-yellow-50/80 !border-yellow-100 !text-yellow-900",
          info: "!bg-blue-50/80 !border-blue-100 !text-blue-900",
        },
      }}
      {...props} />
  );
}

export { Toaster }
