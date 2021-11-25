import React from 'react'
import Layout from '../../components/Layout'


const Prestamos = () => {
    
    return (
        <>
            <Layout>
                <div>
                    <h1 className="text-2xl text-gray-800 font-light" >Prestamos de Libros</h1>
                <div className="flex justify-center mt-5" >
                    <div className="w-full max-w-xl" >
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido"  >
                                    Libro a Prestar
                                </label>
                        <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                                        leading-tight focus:outline-none focus:shadow-outline mb-5"                             
                        >
                            LIBRO
                        </div>
                    </div>
                    </div>             
                </div>
            </Layout>
            
        </>
    )
}

export default Prestamos
