import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import Async from "@/components/routes/LazyComponent";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const route = (component, path = "*", rest) => {
  return {
    element: Async(component),
    path,
    ...rest,
  };
};

export const privateRoute = (component, path = "/", props={}) => {
  return route(component, path, { private: true, ...props });
};

export const redirectRoute = (component, path = "/", props = {}) => {
  return route(component, path, { redirect: true, ...props });
};

export const publicRoute = (component, path = "/", props = {}) => {
  return route(component, path, { public: true, ...props });
};