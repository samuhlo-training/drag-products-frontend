# 🛒 Pacman Frontend - Editor de Categorías

![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-Latest-purple?logo=vite)
![Zustand](https://img.shields.io/badge/Zustand-Latest-yellow)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Latest-38B2AC?logo=tailwind-css)

## 📝 Descripción

Editor visual de categorías para e-commerce que permite organizar productos en filas con diferentes plantillas de alineación.

## ✨ Características

- **Gestión de Filas**: Añadir y eliminar filas de productos
- **Plantillas de Alineación**: Organizar productos con alineación izquierda, centro o derecha
- **Gestión de Productos**: Añadir y eliminar productos en cada fila (máximo 3 por fila)
- **Control de Zoom**: Ajustar el nivel de zoom para visualizar mejor el diseño
- **UI Responsiva**: Interfaz adaptable a diferentes tamaños de pantalla

## 🛠️ Tecnologías

- **React**: Biblioteca para construir interfaces de usuario
- **TypeScript**: Tipado estático para JavaScript
- **Zustand**: Gestión de estado ligera y sencilla
- **TailwindCSS**: Framework CSS utilitario
- **Vite**: Herramienta de construcción rápida

## 🏗️ Arquitectura

```
src/
├── features/
│   └── category-editor/     # Módulo principal
│       ├── components/      # Componentes UI
│       └── types.ts         # Definiciones de tipos
└── store/
    └── categoryStore.ts     # Estado global con Zustand
```

## 🚀 Instalación y Uso

```bash
# Clonar el repositorio
git clone https://github.com/samuhlo-training/pacman-frontend.git

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## 📸 Vista Previa

[Captura de pantalla del editor de categorías]

---

Desarrollado como prueba técnica por Samuel Hernández.
