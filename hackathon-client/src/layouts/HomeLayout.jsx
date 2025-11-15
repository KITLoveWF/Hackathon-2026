export default function HomeLayout({ children }) {
  return (
    <div>
        <header>
            <h1>Welcome to the Hackathon Platform</h1>
        </header>
        <main>{children}</main>
        <footer>
            <p>&copy; 2024 Hackathon Inc.</p>
        </footer>
    </div>
  )
}