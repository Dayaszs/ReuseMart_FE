import { createTheme } from "flowbite-react";

const flowbiteTheme = createTheme({
  tabs: {
    tablist: {
      tabitem: {
        base: "flex items-center justify-center p-4 text-sm font-medium first:ml-0 focus:outline-none disabled:cursor-not-allowed disabled:text-gray-400 disabled:dark:text-gray-500",
        variant: {
          underline: {
            base: "rounded-t-lg",
            active: {
              on: "border-b-2 border-green-500 text-green-500 dark:border-green-400 dark:text-green-400",
              off: "border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300",
            },
          },
        },
      },
    },
  },
});

export default flowbiteTheme;
