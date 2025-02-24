import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import levenshtein from "fast-levenshtein";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function data64ToFile(dataUrl: string) {
  const arr = dataUrl.split(",");

  // Ensure that the data URL contains a valid MIME type
  const mimeMatch = arr[0].match(/:(.*?);/);
  if (!mimeMatch) {
    throw new Error("Invalid data URL: MIME type could not be extracted.");
  }
  const mime = mimeMatch[1]; // Extract MIME type (e.g., image/jpeg)

  const bstr = atob(arr[1]); // Decode base64 string

  let n = bstr.length;
  const u8arr = new Uint8Array(n); // Create a new ArrayBuffer of the same length

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n); // Fill the array with decoded data
  }

  // Generate a default filename based on MIME type
  const extension = mime.split("/")[1] || "png"; // Default to 'png' if extension is missing
  const filename = `image_${Date.now()}.${extension}`;

  // Create the File object
  return new File([u8arr], filename, { type: mime });
}


export function isAcceptableAnswer(answer: string, possibleAnswers: string[],type:string) {
  let maxDistance : number;
  const normalizedAnswer = answer.trim().toLowerCase();
  if(type=="word"){
    maxDistance=1;
  }else{
    maxDistance = 3;
  }
  return possibleAnswers.some(
    (possible) =>
      levenshtein.get(normalizedAnswer, possible.toLowerCase()) <= maxDistance
  );
}

export function timeAgo(timestamp: number | string | Date): string {
  const now = new Date();
  const date = new Date(timestamp);
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (secondsAgo < 60) return `${secondsAgo} sec${secondsAgo !== 1 ? "s" : ""} ago`;
  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) return `${minutesAgo} min${minutesAgo !== 1 ? "s" : ""} ago`;
  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) return `${hoursAgo} hour${hoursAgo !== 1 ? "s" : ""} ago`;
  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo < 7) return `${daysAgo} day${daysAgo !== 1 ? "s" : ""} ago`;
  const weeksAgo = Math.floor(daysAgo / 7);
  if (weeksAgo < 4) return `${weeksAgo} week${weeksAgo !== 1 ? "s" : ""} ago`;
  const monthsAgo = Math.floor(daysAgo / 30);
  if (monthsAgo < 12) return `${monthsAgo} month${monthsAgo !== 1 ? "s" : ""} ago`;
  const yearsAgo = Math.floor(daysAgo / 365);
  return `${yearsAgo} year${yearsAgo !== 1 ? "s" : ""} ago`;
}

