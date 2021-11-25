import { useFormik } from 'formik'
import React from 'react'
import Layout from '../components/Layout'
import * as Yup from 'yup'
import { useMutation, gql } from '@apollo/client'
import { useRouter } from 'next/router'
import Swal from 'sweetalert2'


//Query trae todos los autores

const NEW_AUTHOR = gql`
    mutation CreateAuthor($input: AuthorInput!) {
        createAuthor(input: $input) {
            fullName
        }
}
`




const NuevoAutor = () => {

    const router = useRouter();

    
    //Mutation para crear un nuevo AUTOR
    const [ nuevoAutor ] = useMutation(NEW_AUTHOR);
    //console.log(data);
    
    
    
    //Validacion del Formulario
    const formik = useFormik({
        initialValues: {
            autor: '',                     
            },
            validationSchema: Yup.object({
                autor: Yup.string().required('El nombre del autor es obligatorio'),
                                
            }),    
            onSubmit: async valores => {
                //console.log(valores);
                const { autor } = valores;
                try {
                  const { data } = await nuevoAutor({
                       variables: {
                           input: {                                                              
                               fullName: autor                               
                           }
                       }
                   });
                   //console.log(data);
                   Swal.fire({
                    icon: 'success',
                    title: 'OK',
                    text: 'Se ingreso el Autor correctamente',            
                  })
                   router.push('/')
                } catch (error) {
                    //console.log(error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...Hubo un problema',
                        text: `${error}`,                        
                      })
                }
             }
    })

        

   

    return (
        <>
            <Layout>
                <h1 className="text-center text-gray-800 text-2xl" >Ingresar Nuevo Autor</h1>
                <div className="flex justify-center mt-5" >
                    <div className="w-full max-w-xl">
                        
                        <form className="bg-white rounded sgadow-md px-8 pt-6 pb-8 mb-4"
                              onSubmit={formik.handleSubmit}  
                            >
                            <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nombre"  >
                                   Autor
                                </label>                                
                                 <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                                        leading-tight focus:outline-none focus:shadow-outline mb-5"
                                        id="autor"
                                        type="text"
                                        placeholder="Ingrese el nombre del autor"
                                        value={formik.values.autor}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                /> 
                                { formik.touched.autor && formik.errors.autor ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                        <p className="font-bold" >Error</p>
                                        <p>{ formik.errors.autor }</p>
                                    </div>
                                ) : null }
                                

                                
                            </div>
                            <input type="submit"
                                   className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                                   value="Guardar Autor" 
                                />
                        </form>

                    </div>

                </div>
            </Layout>
        </>
    )
}

export default NuevoAutor