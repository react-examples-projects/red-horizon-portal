# Página de Vista de Publicación

## Descripción

La página `ViewPublication` permite ver una publicación individual con todos sus detalles, incluyendo imágenes, documentos y contenido HTML renderizado.

## Características Implementadas

### 1. **Navegación y Rutas**

- **Ruta**: `/admin/publicacion/:id`
- **Acceso**: Solo usuarios autenticados (ruta privada)
- **Navegación**: Botón "Volver al Panel" para regresar al AdminDashboard

### 2. **Fetch de Datos**

- **Hook**: `useGetPostById(id)` de React Query
- **API**: `getPostById(id)` que hace GET a `/api/posts/:id`
- **Cache**: React Query maneja el cache automáticamente
- **Reintento**: Botón para reintentar en caso de error

### 3. **Renderizado de HTML**

- **Componente**: `HtmlContent` para renderizar contenido HTML seguro
- **Descripción**: Se renderiza como HTML usando `dangerouslySetInnerHTML`
- **Estilos**: Clase `prose` para mejor tipografía

### 4. **Información de la Publicación**

- **Título**: Título principal de la publicación
- **Categoría**: Badge con color según la categoría
- **Autor**: Nombre del autor de la publicación
- **Fechas**: Fecha de creación y actualización (si es diferente)
- **Estado**: Indicador "Vista previa"

### 5. **Gestión de Imágenes**

- **Grid Responsivo**: 1 columna en móvil, 2 en tablet, 3 en desktop
- **Hover Effects**: Efectos al pasar el mouse sobre las imágenes
- **Botón "Ver"**: Abre la imagen en nueva pestaña
- **Alt Text**: Texto alternativo para accesibilidad

### 6. **Gestión de Documentos**

- **Iconos por Tipo**: Diferentes iconos según el tipo de archivo
  - PDF: Icono rojo
  - Word: Icono azul
  - Excel: Icono verde
- **Información del Archivo**: Nombre y tamaño
- **Descarga**: Botón para descargar el documento
- **Tamaño Formateado**: KB, MB, GB según corresponda

### 7. **Estados de Carga**

- **Loading**: Skeleton loaders mientras carga
- **Error**: Mensaje de error con botones de acción
- **Empty**: Manejo de casos sin datos

### 8. **Botones de Acción**

- **Editar**: Redirige a `/admin/editar-publicacion/:id`
- **Volver**: Regresa al panel administrativo

## Estructura de Datos Esperada

```typescript
interface Publication {
  _id: string;
  title: string;
  description: string; // HTML content
  category: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  images?: Array<{
    url: string;
    filename: string;
    size: number;
  }>;
  documents?: Array<{
    url: string;
    filename: string;
    size: number;
  }>;
  createdAt: string;
  updatedAt: string;
}
```

## Integración con AdminDashboard

### Botón del Ojo

- **Ubicación**: En cada fila de publicación en AdminDashboard
- **Acción**: Redirige a `/admin/publicacion/:id`
- **Estilo**: Botón azul con icono de ojo

### Navegación

- **Desde AdminDashboard**: Click en botón del ojo
- **Desde ViewPublication**: Botón "Volver al Panel"
- **Edición**: Botón "Editar Publicación" en ViewPublication

## Características de UX

### 1. **Responsive Design**

- **Móvil**: 1 columna para imágenes
- **Tablet**: 2 columnas para imágenes
- **Desktop**: 3 columnas para imágenes

### 2. **Accesibilidad**

- **Alt Text**: Para todas las imágenes
- **ARIA Labels**: Para botones y enlaces
- **Contraste**: Colores con buen contraste

### 3. **Performance**

- **Lazy Loading**: React Query maneja el cache
- **Optimización**: Solo carga cuando es necesario
- **Skeleton**: Feedback visual durante la carga

### 4. **Error Handling**

- **Network Errors**: Manejo de errores de red
- **Not Found**: Manejo de publicaciones no encontradas
- **Retry**: Botón para reintentar la carga

## Estilos y Diseño

### 1. **Consistencia Visual**

- **Colores**: Misma paleta que AdminDashboard
- **Tipografía**: Misma fuente y tamaños
- **Espaciado**: Consistente con el resto de la app

### 2. **Componentes UI**

- **Card**: Contenedor principal con borde rojo
- **Badge**: Para categorías con colores específicos
- **Button**: Botones con variantes outline y filled
- **Skeleton**: Para estados de carga

### 3. **Iconos**

- **Lucide React**: Iconos consistentes
- **Colores**: Según el contexto (rojo para eliminar, azul para ver, etc.)

## Funcionalidades Futuras

### 1. **Comentarios**

- Sistema de comentarios en publicaciones
- Moderación de comentarios

### 2. **Compartir**

- Botones para compartir en redes sociales
- Enlaces directos a publicaciones

### 3. **Impresión**

- Vista optimizada para imprimir
- PDF de la publicación

### 4. **Historial de Cambios**

- Ver versiones anteriores de la publicación
- Comparar cambios

## Notas Técnicas

### 1. **Seguridad**

- **HTML Sanitization**: Considerar sanitizar HTML del backend
- **XSS Protection**: `dangerouslySetInnerHTML` debe usarse con cuidado

### 2. **Performance**

- **Image Optimization**: Considerar lazy loading para imágenes
- **Document Previews**: Previews de documentos antes de descargar

### 3. **SEO**

- **Meta Tags**: Para publicaciones públicas
- **Structured Data**: Para mejor indexación

### 4. **Analytics**

- **Page Views**: Tracking de vistas de publicaciones
- **User Engagement**: Tiempo en página, descargas, etc.
