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
// 有服务器 pnpm start
// 无服务器 pnpm dev
