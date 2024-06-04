import { useSelector } from "react-redux";
import { lang } from "./languageConstants";

const dateHandler = (inputTime) => {
  const { language: langKey } = useSelector((store) => store.user);
  // Parse input time string into Date object
  const inputDate = new Date(inputTime);

  // Get current date
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1); // Set the date to yesterday

  // Check if input time is exactly current time
  if (inputDate.getTime() === today.getTime()) {
    // Format the time to hours:minutes
    const formattedTime = inputDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC", // Explicitly set the time zone to UTC
    });
    return `${lang[langKey].Just_now}`;
  }

  // Check if input time belongs to today
  if (
    inputDate.getDate() === today.getDate() &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getFullYear() === today.getFullYear()
  ) {
    // Format the time to hours:minutes
    const formattedTime = inputDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return formattedTime;
  }

  // Check if input time belongs to yesterday
  if (
    inputDate.getDate() === yesterday.getDate() &&
    inputDate.getMonth() === yesterday.getMonth() &&
    inputDate.getFullYear() === yesterday.getFullYear()
  ) {
    return `${lang[langKey].yesterday}`;
  }

  // If it's not today or yesterday, return formatted date
  const formattedDate = inputDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  return formattedDate;
};

export default dateHandler;
