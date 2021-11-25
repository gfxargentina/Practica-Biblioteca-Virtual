import { useQuery, gql } from '@apollo/client'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Layout from '../components/Layout'


export const GET_ALL_BOOKS = gql`
  query{
    getAllBooks{
      id
      title
      isOnLoan
      author{
        id
        fullName
      }
    }
}
`


function searchBook(term)  {   
  return function(x){
    //console.log(typeof x);        
    return x.title.toLowerCase().includes(term) || !term;     
        
  }
}

function searchAuthor(termAuthor)  {   
  return function(x){
    //console.log(typeof x);        
    return x.author.fullName.toLowerCase().includes(termAuthor) || !termAuthor;     
        
  }
}



export default function Home() {
  
  const router = useRouter();

  //barra de busqueda
  const [term, setTerm] = useState('');
  const [termAuthor, setTermAuthor] = useState('')
  
   
  
  const { data, loading, error } = useQuery(GET_ALL_BOOKS);
  //console.log(data);
  

  if(loading) return 'Cargando Libros....';

  if(!data) {    
    return window.location.href="login";
    //router.push('/login');
  }
  

  // const bookIsOnLoan = data.getAllBooks.map( libro => (
  //   libro.isOnLoan
  // ))
  //console.log(bookIsOnLoan);
  
    
  

  
  


  return (
    <>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light mb-5" >Libros</h1>
        <Link href="/nuevo-libro" >
            <a className="h-8 px-4 py-2 mr-5 text-sm text-indigo-100 transition-colors duration-150 bg-blue-700 
                                      rounded-lg focus:shadow-outline hover:bg-blue-800" >Nuevo Libro</a>
        </Link>

        <Link href="/nuevo-autor" >
            <a className="h-8 px-4 py-2 text-sm text-indigo-100 transition-colors duration-150 bg-blue-700 
                                      rounded-lg focus:shadow-outline hover:bg-blue-800" >Nuevo autor</a>
        </Link>

        <div className="flex flex-col mt-5">
                      <label className="mr-3 font-medium text-green-700 text-center">Buscar Libro por nombre o por autor</label>
                            <input type="text" 
                                    name="term"
                                    placeholder="escriba el nombre del libro"
                                    onChange={ e => setTerm(e.target.value)}                                
                                    className="h-10 px-5 mb-5 text-indigo-700 transition-colors duration-150 border border-indigo-500 rounded-lg focus:outline-none"
                            />
                            <input type="text" 
                                    name="termAuthor"
                                    placeholder="escriba el nombre del autor"
                                    onChange={ e => setTermAuthor(e.target.value)}                                
                                    className="h-10 px-5 mb-5 text-indigo-700 transition-colors duration-150 border border-indigo-500 rounded-lg focus:outline-none"
                            />
                      </div>
        
        <table className="table-auto shadow-md mt-10 w-full w-lg" >
          <thead className="bg-gray-800" >
            <tr className="text-white" >
              <th className="w-1/5 py-2" >Autor</th>
              <th className="w-1/5 py-2" >Titulo</th>
              <th className="w-1/5 py-2" >Acciones</th>
            </tr>

          </thead>
          <tbody className="bg-white" >
            {
              
              data?.getAllBooks.filter(searchBook(term)).filter(searchAuthor(termAuthor)).map( libro => (
                <tr key={libro.id}>
                  <td className="border px-4 py-2">{libro.author.fullName}</td>
                  <td className="border px-4 py-2">{libro.title}</td>
                  <td className="border px-4 py-2" >
                  <Link href={"/prestamos/" + libro.id }>
                     <a className={` ${ libro.isOnLoan  ? 'bg-yellow-700' : 'bg-green-700 hover:bg-green-800' }  h-8 px-4 m-2 text-sm text-indigo-100 transition-colors duration-150  
                                      rounded-lg focus:shadow-outline 
                                       `}
                            name={libro.id}           
                            > {libro.isOnLoan  ? 'PRESTADO' : 'Prestar'} 
                                       </a> 
                    
                   </Link>
                    {libro.isOnLoan ? <button className="h-8 px-4 m-2 text-sm text-indigo-100 transition-colors duration-150 bg-indigo-700 
                                      rounded-lg focus:shadow-outline hover:bg-indigo-800">Devolver</button>  : ''}
                    
                    <button className="h-8 px-4 m-2 text-sm text-indigo-100 transition-colors duration-150 bg-yellow-500 
                                      rounded-lg focus:shadow-outline hover:bg-yellow-800">Editar</button>
                    <button className="h-8 px-4 m-2 text-sm text-indigo-100 transition-colors duration-150 bg-red-700 
                                      rounded-lg focus:shadow-outline hover:bg-red-800">Eliminar</button>
                                                        
                  </td>                
                </tr>
              ))
            }
          </tbody>

        </table>
      </Layout>
    </>
  )
}
