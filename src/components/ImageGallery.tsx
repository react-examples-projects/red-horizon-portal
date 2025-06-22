
import { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";

interface ImageGalleryProps {
  images: Array<{
    url: string;
    title: string;
    description?: string;
  }>;
}

export const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  return (
    <div className="w-full">
      <Carousel className="w-full max-w-4xl mx-auto">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-0">
                    <div 
                      className="relative cursor-pointer group"
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={image.url}
                        alt={image.title}
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="text-white font-medium text-lg">Ver imagen</span>
                      </div>
                    </div>
                    {image.title && (
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900">{image.title}</h3>
                        {image.description && (
                          <p className="text-sm text-gray-600 mt-1">{image.description}</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="border-red-200 text-red-600 hover:bg-red-50" />
        <CarouselNext className="border-red-200 text-red-600 hover:bg-red-50" />
      </Carousel>

      {/* Modal para imagen ampliada */}
      {selectedImage !== null && (
        <div 
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={images[selectedImage].url}
              alt={images[selectedImage].title}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-black/70 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
