import type { Metadata } from "next";
import "./globals.css";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: {
    default: "地质构造实验室 · 高中地理互动教学",
    template: "%s · 地质构造实验室",
  },
  description:
    "面向高中地理课堂的地质构造数字实验室：亲手操作岩层、观察褶皱与断层、模拟地貌演化、寻找地下资源并完成判读训练。",
  keywords: ["地质构造", "褶皱", "断层", "背斜", "向斜", "地垒", "地堑", "高中地理", "互动教学"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <SiteNav />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
