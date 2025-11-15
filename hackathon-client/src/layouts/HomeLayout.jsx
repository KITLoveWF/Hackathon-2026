export default function HomeLayout({ children }) {
  return (
    <div>
        <header>
            <h3 >Welcome to the Hackathon Platform</h3>
        </header>
        <main>{children}</main>
        <footer>
            <p className='text-3xl font-bold underline'>&copy; 2024 Hackathon Inc.</p>
            <h1 className="text-3xl font-bold underline">
            Hello world!
          </h1>
        </footer>
    </div>
  )
}