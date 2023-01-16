import Link from "next/link"

function Header() {
  return (
    <header className="bg-medium-yellow border-b border-black">
      <div className="max-w-7xl mx-auto flex justify-between p-5">
        <div className="flex items-center space-x-5">
          <Link href="/">
            <img
              className="w-44 cursor-pointer object-contain"
              src="https://upload.wikimedia.org/wikipedia/commons/0/0d/Medium_%28website%29_logo.svg"
              alt="Blog - Logo"
            />
          </Link>
        </div>
        <div className="flex items-center space-x-5 text-sm">
          <div className="hidden md:inline-flex items-center space-x-5">
            <h3>About</h3>
            <h3>Contact</h3>
            <h3>Sign In</h3>
          </div>
          <h3 className="px-5 py-2 rounded-full bg-black text-white">
            Get Started
          </h3>
        </div>
      </div>
    </header>
  )
}

export default Header
