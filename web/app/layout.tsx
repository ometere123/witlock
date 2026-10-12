import type { Metadata } from 'next';
import './globals.css';
import AppShell from '@/app/_components/AppShell';
export const metadata:Metadata={title:'WITLOCK — Evidence before finality',description:'StudioNet agreement and evidence authority workspace.'};
export default function Layout({children}:{children:React.ReactNode}) {return <html lang="en"><body><AppShell>{children}</AppShell></body></html>}
