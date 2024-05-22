import { setCookie, getCookie, deleteCookie } from "cookies-next";

const useLocalStorage = () => {
  const setItem = (key: string, value: any) => {
    // const encrypted = btoa(value as string);
    // localStorage.setItem(key, encrypted);
    setCookie(key, value, { secure: true });
  };

  const getItem = (key: string) => {
    // const value = localStorage.getItem(key);
    const value = getCookie(key);
    // const decrypt = atob(String(value));
    return value;
  };

  const removeItem = (key: string) => {
    // localStorage.removeItem(key);
    deleteCookie(key);
  };

  return {
    setItem,
    getItem,
    removeItem,
  };
};

export default useLocalStorage;
