import type { Metadata } from 'next';
import './globals.css';
export const metadata:Metadata={title:'WITLOCK — Evidence before finality',description:'StudioNet agreement and evidence authority workspace.'};
export default function Layout({children}:{children:React.ReactNode}) {return <html lang="en"><body>{children}</body></html>}
