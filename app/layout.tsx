import "@/app/ui/global.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("11", children);
  return (
    <html lang="en">
      <head></head>
      <body>{children}</body>
    </html>
  );
}
