
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Quote,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditor = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const insertLink = () => {
    if (linkUrl) {
      execCommand('createLink', linkUrl);
      setLinkUrl('');
      setIsLinkModalOpen(false);
    }
  };

  const toolbarButtons = [
    { command: 'bold', icon: Bold, title: 'Negrita' },
    { command: 'italic', icon: Italic, title: 'Cursiva' },
    { command: 'underline', icon: Underline, title: 'Subrayado' },
    { command: 'insertUnorderedList', icon: List, title: 'Lista con viñetas' },
    { command: 'insertOrderedList', icon: ListOrdered, title: 'Lista numerada' },
    { command: 'formatBlock', icon: Quote, title: 'Cita', value: 'blockquote' },
    { command: 'justifyLeft', icon: AlignLeft, title: 'Alinear izquierda' },
    { command: 'justifyCenter', icon: AlignCenter, title: 'Centrar' },
    { command: 'justifyRight', icon: AlignRight, title: 'Alinear derecha' },
  ];

  return (
    <div className="border border-red-200 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-red-100 bg-gray-50 flex-wrap">
        {toolbarButtons.map((btn) => (
          <Button
            key={btn.command}
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => execCommand(btn.command, btn.value)}
            className="h-8 w-8 p-0 hover:bg-red-100"
            title={btn.title}
          >
            <btn.icon className="h-4 w-4" />
          </Button>
        ))}
        
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => setIsLinkModalOpen(true)}
          className="h-8 w-8 p-0 hover:bg-red-100"
          title="Insertar enlace"
        >
          <Link className="h-4 w-4" />
        </Button>

        <div className="flex items-center gap-2 ml-2">
          <select
            onChange={(e) => execCommand('formatBlock', `<${e.target.value}>`)}
            className="text-sm border border-red-200 rounded px-2 py-1"
            defaultValue=""
          >
            <option value="">Normal</option>
            <option value="h1">Título 1</option>
            <option value="h2">Título 2</option>
            <option value="h3">Título 3</option>
            <option value="p">Párrafo</option>
          </select>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="min-h-[200px] p-4 focus:outline-none focus:ring-2 focus:ring-red-500"
        onInput={handleContentChange}
        dangerouslySetInnerHTML={{ __html: value }}
        style={{ whiteSpace: 'pre-wrap' }}
        data-placeholder={placeholder}
      />

      {/* Link Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Insertar enlace</h3>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://ejemplo.com"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
              autoFocus
            />
            <div className="flex gap-2 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsLinkModalOpen(false);
                  setLinkUrl('');
                }}
              >
                Cancelar
              </Button>
              <Button
                type="button"
                onClick={insertLink}
                className="bg-red-600 hover:bg-red-700"
              >
                Insertar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;
