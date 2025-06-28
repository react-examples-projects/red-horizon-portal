import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import Async from "@/components/routes/LazyComponent";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createTextPreview(htmlContent: string, maxLength: number = 150): string {
  // Remover tags HTML para obtener solo texto
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  const textContent = tempDiv.textContent || tempDiv.innerText || '';
  
  // Limpiar espacios extra y saltos de línea
  const cleanText = textContent.replace(/\s+/g, ' ').trim();
  
  // Si el texto es más corto que maxLength, devolverlo completo
  if (cleanText.length <= maxLength) {
    return cleanText;
  }
  
  // Cortar en maxLength y agregar "..."
  return cleanText.substring(0, maxLength) + '...';
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

export const noop = () => {};