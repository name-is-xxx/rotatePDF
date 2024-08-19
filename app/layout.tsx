import "@/app/ui/global.css";
import Index from ".";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Index />
        {/* {children} */}
      </body>
    </html>
  );
}
