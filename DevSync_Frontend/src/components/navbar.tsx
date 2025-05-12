import {Link} from "react-router-dom"
import { Button } from "../components/ui/button"
import { Code } from "lucide-react"

export default function Navbar() {
    return (
        <header className="border-b border-gray-800 py-4">
            <div className="container mx-auto flex items-center justify-between px-4">
                <Link to="/" className="flex items-center gap-2 text-xl font-bold">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-500 text-black">
                        <Code size={20} />
                    </div>
                    <span>DevSync</span>
                </Link>
                <nav className="hidden md:block">
                    <ul className="flex space-x-8">
                        <li>
                            <Link to="/features" className="text-gray-300 hover:text-white">
                                Features
                            </Link>
                        </li>
                        <li>
                            <Link to="/workflow" className="text-gray-300 hover:text-white">
                                Workflow
                            </Link>
                        </li>
                        <li>
                            <Link to="/about" className="text-gray-300 hover:text-white">
                                About
                            </Link>
                        </li>
                        <li>
                            <Link to="/how-it-works" className="text-gray-300 hover:text-white">
                                See how it works
                            </Link>
                        </li>
                        <li>
                            <Link to="/contact" className="text-gray-300 hover:text-white">
                                Contact Us
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className="flex items-center gap-4">
                    <Link to="/signin">
                        <Button variant="ghost" className="text-gray-300 hover:text-white">
                            Sign In
                        </Button>
                    </Link>
                    <Link to="/signup">
                        <Button className="bg-emerald-500 text-black hover:bg-emerald-600">Sign Up</Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}
