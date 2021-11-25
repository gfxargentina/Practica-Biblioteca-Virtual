import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';



const Sidebar = () => {

    // routing de nextjs
    const router = useRouter();

    return (
        <aside className="bg-gray-800 sm:w-1/3 sm:min-h-screen p-5 xl:w-1/5" >
            <div>
                <p className="text-white text-2xl font-bold "  >Biblioteca App</p>
            </div>
            <nav className="mt-5 list-none" >
                <li className={ router.pathname === "/" ? "bg-blue-800 p-2" : "p-2" } >
                    <Link href="/" >
                        <a className="text-white mb-3 block">
                            Libros
                        </a>
                    </Link>                    
                </li>
                <li className={ router.pathname === "/prestamos" ? "bg-blue-800 p-2" : "p-2" } >
                <Link href="/prestamos" >
                    <a className="text-white mb-3 block">
                            Prestamos
                        </a>
                    </Link>
                </li>
            </nav>
        </aside>
    )
}

export default Sidebar
