# eShopS32 - Modern E-commerce Platform

A modern, feature-rich e-commerce platform built with React and Vite, offering a seamless shopping experience with multi-language support, responsive design, and comprehensive admin capabilities.

## Features

- 🛍️ **Modern E-commerce Interface**
  - Intuitive product browsing and shopping cart
  - Category-based product organization
  - Responsive design for all devices

- 🌐 **Multi-language Support**
  - Built-in support for English, Spanish, and French
  - Easy language switching

- 🔒 **User Authentication**
  - Secure user authentication system
  - Role-based access control (Admin/User)
  - Protected routes

- 🎨 **Customization**
  - Theme customization
  - Landing page configuration
  - Store appearance settings

- 📱 **Responsive Design**
  - Mobile-first approach
  - Adaptive layouts
  - Cross-device compatibility

## Technology Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **UI Framework:** Chakra UI
- **State Management:** Zustand
- **Routing:** React Router DOM
- **API Client:** Axios & React Query
- **Internationalization:** i18next
- **Additional Libraries:**
  - react-pro-sidebar
  - react-icons
  - react-hot-toast
  - framer-motion
  - And more!

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone [https://github.com/AXG25/eShopS32]
   cd eshops32
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.production`:
   ```bash
   cp .env.production .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
/src
  /Components     # Reusable components
  /context        # React context providers
  /hooks          # Custom React hooks
  /layouts        # Layout components
  /locales        # Translation files
  /pages          # Page components
  /router         # Routing configuration
  /services       # API services
  /store          # State management
  /styles         # Global styles and theme
  /utils          # Utility functions
```
