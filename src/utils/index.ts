import { ROUTES_KEY } from "@/config/constants";

export const checkRouteExist = (pathname: string) => {
  return !!ROUTES_KEY.filter((val) => val === String(pathname)).length;
};

export const capitalizeEachWords = (sentences: string) => {
  let string = sentences
    ?.split(" ")
    .map((word: string) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
  return string;
};
