import { ChakraProvider } from '@chakra-ui/react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayaout from './components/MainLayaout'
import Banner from './pages/controlPanel/Banner'
import Logo from './pages/controlPanel/Logo'
import Social from './pages/controlPanel/Social'
import ColorPalette from './pages/controlPanel/ColorPalette'
import AboutUs from './pages/controlPanel/AboutUs'
import ContactUs from './pages/controlPanel/ContactUs'
import DataSync from './pages/controlPanel/DataSync'
import Config from './pages/controlPanel/Config'
import Index from './pages/Index'
import Categories from './pages/Categories'
import AboutUsView from './pages/AboutUsView'
import Products from './pages/Products'
import ContactUsView from './pages/ContactUsView'
import ShoppingCart from './pages/ShoppingCart'

function App() {

  const router = createBrowserRouter([
    {
      path: '/',
      element: <MainLayaout />,
      children: [
        { path: '/banner', element: <Banner /> },
        { path: '/logo', element: <Logo /> },
        { path: '/social', element: <Social /> },
        { path: '/colorPalette', element: <ColorPalette /> },
        { path: '/aboutUs', element: <AboutUs /> },
        { path: '/contactUs', element: <ContactUs /> },
        { path: '/dataSync', element: <DataSync /> },
        { path: '/config', element: <Config /> },
        { path: '/', element: <Index /> },
        { path: '/categorias', element: <Categories /> },
        { path: '/nosotros', element: <AboutUsView /> },
        { path: '/productos', element: <Products /> },
        { path: '/contacto', element: <ContactUsView /> },
        { path: '/carrito', element: <ShoppingCart /> },

      ]
    }
  
  ])

  return (
    <>
      <ChakraProvider>
      <RouterProvider router={router} />
      </ChakraProvider>
    </>
  )
}

export default App
