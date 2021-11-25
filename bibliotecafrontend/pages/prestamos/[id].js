import React from 'react'
import Layout from '../../components/Layout'
import { useMutation, gql, useQuery } from '@apollo/client'
import { useRouter } from 'next/router'
import dayjs from "dayjs";


const GET_BOOK_BY_ID = gql`
    query GetBookById($input: BookIdInput!) {
            getBookById(input: $input) {
                title
                author {
                fullName
                }
            }
}

`



const Prestamos = () => {

    let now = dayjs();

    const router = useRouter();

    //trae el id que le pasamos de index.js
    const { id } = router.query
    //console.log(id);

        
     const { data, loading, error } = useQuery(GET_BOOK_BY_ID, {
         variables: {
             input: {
                 id: parseInt(id)
             }
         }
     });
     if(loading) return null;
     //console.log(data);

    return (
        <>
        <Layout>
            <div>
                <h1 className="text-center text-2xl text-gray-800 " >Libro a Prestar</h1>
            <div className="flex justify-center mt-5" >
                <div className="bg-white rounded shadow-md w-full max-w-xl px-8 pt-6 pb-8 mb-4" >
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido"  >
                                Titulo
                            </label>
                    <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                                    leading-tight focus:outline-none focus:shadow-outline mb-5"                             
                    >
                        {data.getBookById.title}
                    </div>

                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido"  >
                                Autor
                            </label>
                    <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                                    leading-tight focus:outline-none focus:shadow-outline mb-5"                             
                    >
                        {data.getBookById.author.fullName}
                    </div>

                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido"  >
                                Fecha del Prestamo
                            </label>
                    <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                                    leading-tight focus:outline-none focus:shadow-outline mb-5"                             
                    >
                        {now.format("DD/MM/YYYY")}
                    </div>

                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="apellido"  >
                                Fecha de devolución del libro
                            </label>
                    <div className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                                    leading-tight focus:outline-none focus:shadow-outline mb-5"                             
                    >
                        {now.add(7, 'day').format("DD/MM/YYYY")}
                    </div>
                </div>
                </div>             
            </div>
        </Layout>
        
    </>
    )
}

export default Prestamos


