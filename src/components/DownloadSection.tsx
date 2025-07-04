import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, ExternalLink, File, FileSpreadsheet } from "lucide-react";

interface DownloadItem {
  id: string;
  title: string;
  description?: string;
  type: "pdf" | "word" | "excel" | "link";
  url: string;
  size?: string;
}

interface DownloadSectionProps {
  items: DownloadItem[];
}

export const DownloadSection = ({ items }: DownloadSectionProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "word":
        return <File className="h-5 w-5 text-blue-500" />;
      case "excel":
        return <FileSpreadsheet className="h-5 w-5 text-green-500" />;
      case "link":
        return <ExternalLink className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "pdf":
        return "PDF";
      case "word":
        return "Word";
      case "excel":
        return "Excel";
      case "link":
        return "Enlace";
      default:
        return "Archivo";
    }
  };

  const handleDownload = (item: DownloadItem) => {
    // Verificar si la URL es válida
    if (!item.url || item.url === "" || item.url.startsWith("/docs/")) {
      console.warn("URL no válida para descarga:", item.url);
      return;
    }

    if (item.type === "link") {
      window.open(item.url, "_blank");
    } else {
      // Simular descarga
      const link = document.createElement("a");
      link.href = item.url;
      link.download = item.title;
      link.click();
    }
  };

  // Si no hay items, mostrar mensaje
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-gray-400 mb-4">
              <FileText className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay archivos disponibles</h3>
            <p className="text-gray-600">
              Actualmente no hay archivos o enlaces para descargar. Vuelve más tarde para ver nuevos
              recursos.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => {
        const hasValidUrl = item.url && item.url !== "" && !item.url.startsWith("/docs/");

        return (
          <Card
            key={item.id}
            className={`hover:shadow-lg transition-shadow duration-300 border-red-100 ${
              !hasValidUrl ? "opacity-60" : ""
            }`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start gap-3">
                {getIcon(item.type)}
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                    {item.title}
                  </CardTitle>
                  {item.description && <p className="text-sm text-gray-600">{item.description}</p>}
                  {!hasValidUrl && (
                    <p className="text-xs text-orange-600 mt-1">⚠️ Archivo no subido aún</p>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">
                    {getTypeLabel(item.type)}
                  </span>
                  {item.size && hasValidUrl && <span>{item.size}</span>}
                </div>
                <Button
                  onClick={() => handleDownload(item)}
                  size="sm"
                  disabled={!hasValidUrl}
                  className={`${
                    hasValidUrl
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {!hasValidUrl ? (
                    <>
                      <FileText className="h-4 w-4 mr-1" />
                      Sin archivo
                    </>
                  ) : item.type === "link" ? (
                    <>
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Abrir
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-1" />
                      Descargar
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
