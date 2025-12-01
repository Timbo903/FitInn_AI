import './globals.css'

export const metadata = {
  title: 'FITINN Virtualni Pomočnik',
  description: 'Virtualni asistent za FITINN fitnes studio v Sloveniji',
  manifest: '/manifest.json',
  themeColor: '#EAB308',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FITINN Bot',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }) {
  return (
    <html lang="sl">
      <head>
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect fill='%23000' width='32' height='32' rx='6'/><text x='16' y='14' text-anchor='middle' fill='%23FFF' font-family='Arial Black' font-size='8' font-weight='900' font-style='italic'>FIT</text><text x='16' y='24' text-anchor='middle' fill='%23EAB308' font-family='Arial Black' font-size='8' font-weight='900' font-style='italic'>INN</text></svg>" />
      </head>
      <body className="bg-black">{children}</body>
    </html>
  )
}
