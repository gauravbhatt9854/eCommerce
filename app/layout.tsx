import { ClerkProvider, ClerkLoaded, ClerkLoading } from '@clerk/nextjs'
import './globals.css'
import { dark } from '@clerk/themes'
import Script from 'next/script'
import Nav from './components/nav/page'
import { AdminProvider } from './components/provider/AdminProvider'
import { SocketProvider } from './components/provider/SocketProvider'
import ChatComponent from './components/globalChat/page'


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <ClerkProvider
        appearance={{
          baseTheme: dark,
        }}>
        <SocketProvider>
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
        </SocketProvider>
      </ClerkProvider>
    </AdminProvider>

  )
}