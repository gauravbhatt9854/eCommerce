"use client"
import { ClerkProvider, ClerkLoaded, ClerkLoading } from '@clerk/nextjs'
import './globals.css'
import { dark } from '@clerk/themes'
import Nav from './components/nav/page'
import { AppStateProvider } from './components/provider/AppStateProvider'
import ChatComponent from './components/globalChat/page'
import { SocketProvider } from "./components/provider/SocketProvider";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}>

      <SocketProvider>
      <AppStateProvider>
          <html lang="en">
            <body className='relative'>
              <ChatComponent />
              <header>
                <ClerkLoading>
                  <h1>Clerk is Loading</h1>
                </ClerkLoading>
              </header>
              <ClerkLoaded>
                <Nav></Nav>
                <main>{children}</main>
              </ClerkLoaded>
            </body>
          </html>
      </AppStateProvider>
      </SocketProvider>
    </ClerkProvider>

  )
}