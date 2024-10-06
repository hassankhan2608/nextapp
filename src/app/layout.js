export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>My Serverless App</title>
        <meta name="description" content="A simple serverless app built with Next.js and Tailwind CSS." />
      </head>
      <body>
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
