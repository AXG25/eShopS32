import { ChakraProvider } from '@chakra-ui/react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayaout from './components/MainLayaout'
import Banner from './pages/Banner'
import Logo from './pages/Logo'
import Social from './pages/Social'
import ColorPalette from './pages/ColorPalette'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import DataSync from './pages/DataSync'
import Config from './pages/Config'

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
