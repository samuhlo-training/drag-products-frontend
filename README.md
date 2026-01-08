<div align="center">
  <br />
  <br />
  
  # <code>DRAG_PRODUCTS_FRONTEND</code>
  
  **DRAG & DROP CATEGORY EDITOR / E-COMMERCE LABORATORY**
  
  <br />

  <img src="https://img.shields.io/badge/REACT_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TYPESCRIPT_5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/ZUSTAND-433E38?style=for-the-badge&logo=react&logoColor=white" alt="Zustand" />
  <img src="https://img.shields.io/badge/TAILWIND_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />

  <br />
  <br />
</div>

---

### 00 __ PREVIEW

![Editor Preview](public/portada_editorcategorias.webp)

> **ABSTRACT:** Editor visual para organización de productos en categorías e-commerce mediante drag & drop avanzado. Sistema de filas con plantillas de alineación (izquierda, centro, derecha) y gestión de productos con reordenación multi-contexto. Overlay inteligente escalable según zoom del editor.
>
> <br />
>
> **ORIGIN:** Proyecto personal de experimentación con drag and drop.
> *Implementado con @dnd-kit para drag and drop accesible y Zustand para gestión de estado.*
>
> <br />
>
> **DEMO:** [products-frontend-rho.vercel.app](https://products-frontend-rho.vercel.app/)

---

### 01 __ ARCHITECTURE & DECISIONS

| COMPONENT | TECH | NOTE |
| :--- | :--- | :--- |
| **Core** | `React 18 (Hooks)` | Functional components con TypeScript strict. |
| **State** | `Zustand` | Single store pattern para categorías y filas. |
| **Drag & Drop** | `@dnd-kit` | Contexto único para filas y productos. Overlay escalado dinámico. |
| **Styles** | `TailwindCSS` | Utility-first con configuración custom. |
| **Build Tool** | `Vite` | Fast HMR y optimización de bundle. |

<br>

**KEY PATTERNS:**
- Feature-based folder structure (`features/category-editor/`)
- Tipado estricto para drag events (diferenciación fila vs producto)
- Zoom-aware overlay para coherencia visual durante drag
- Máximo 3 productos por fila con validación en UI

<br>

### 02 __ INSTALLATION

*Run local environment:*

```bash
# 1. Clone
git clone https://github.com/samuhlo-training/drag-products-frontend.git

# 2. Install dependencies
npm install

# 3. Ignite
npm run dev
```

### 03 __ KEY FEATURES / SNIPPETS
Lógica destacada de este experimento:

#### A. DRAG OVERLAY ESCALADO
Sistema de overlay que respeta el zoom del editor para feedback visual coherente.

```typescript
// Overlay escalado dinámicamente según zoom
<DragOverlay>
  {activeId && (
    <div style={{ transform: `scale(${zoomLevel})` }}>
      {/* Render dragged element */}
    </div>
  )}
</DragOverlay>
```

#### B. MULTI-CONTEXT DRAG SYSTEM
Soporte para reordenar filas Y mover productos entre filas con un solo DndContext.

```typescript
const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  
  // Detectar si es drag de fila o producto
  if (active.id.toString().startsWith('row-')) {
    // Handle row reordering
  } else {
    // Handle product movement/reordering
  }
};
```

<div align="center">

<br />

<code>DESIGNED & CODED BY <a href='https://github.com/samuhlo'>samuhlo</a></code>

<br />

<small>Lugo, Galicia</small>

</div>
