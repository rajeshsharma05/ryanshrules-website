import './global.css'

export const metadata = {
    title: "Ryansh's Creative World",
    description: 'Portfolio of comics, videos, and creative works by Ryansh Sharma',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body>{children}</body>
        </html>
    )
}