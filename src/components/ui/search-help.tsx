import React, { useState } from "react";
import { HelpCircle, X, Search } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

interface SearchHelpProps {
  onExampleClick: (example: string) => void;
}

export const SearchHelp: React.FC<SearchHelpProps> = ({ onExampleClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const examples = [
    {
      search: "rob",
      finds: ["robo", "robusto", "robar", "robótica"],
      description: 'Encuentra palabras que contengan "rob"',
    },
    {
      search: "mant",
      finds: ["mantenimiento", "mantener", "mantenido"],
      description: "Encuentra palabras relacionadas con mantenimiento",
    },
    {
      search: "seg",
      finds: ["seguridad", "seguro", "asegurar"],
      description: "Encuentra palabras relacionadas con seguridad",
    },
    {
      search: "event",
      finds: ["eventos", "eventual", "eventualidad"],
      description: "Encuentra palabras relacionadas con eventos",
    },
  ];

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="text-gray-500 hover:text-gray-700"
      >
        <HelpCircle className="h-4 w-4 mr-1" />
        Cómo buscar
      </Button>
    );
  }

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-blue-800 text-sm">Cómo funciona la búsqueda</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <p className="text-sm text-blue-700">
            La búsqueda es <strong>parcial</strong>, lo que significa que encuentra palabras que
            contengan el término que escribas.
          </p>

          <div className="space-y-2">
            <p className="text-xs font-medium text-blue-800">Ejemplos:</p>
            {examples.map((example, index) => (
              <div key={index} className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Search className="h-3 w-3 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Buscar: "{example.search}"
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onExampleClick(example.search)}
                    className="h-6 px-2 text-xs border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    Probar
                  </Button>
                </div>
                <p className="text-xs text-blue-600 mb-1">{example.description}</p>
                <p className="text-xs text-gray-600">
                  Encuentra:{" "}
                  <span className="font-mono bg-gray-100 px-1 rounded">
                    {example.finds.join(", ")}
                  </span>
                </p>
              </div>
            ))}
          </div>

          <div className="text-xs text-blue-600 bg-blue-100 p-2 rounded">
            <strong>Tip:</strong> Usa términos cortos para obtener más resultados. La búsqueda
            funciona en títulos y descripciones.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchHelp;
