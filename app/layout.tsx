"use client"
import './globals.css'
import Nav from './(components)/nav/page'
import { AppStateProvider } from './(components)/provider/AppStateProvider'
import ChatComponent from './(components)/globalChat/page'
import { SocketProvider } from "./(components)/provider/SocketProvider";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
      <AppStateProvider>
      <SocketProvider>
          <html lang="en">
            <body className='relative'>
              <ChatComponent />
              <header>
              </header>
                <Nav></Nav>
                <main>{children}</main>
            </body>
          </html>
      </SocketProvider>
      </AppStateProvider>
  )
}