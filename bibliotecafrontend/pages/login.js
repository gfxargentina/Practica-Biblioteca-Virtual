import { useFormik } from 'formik'
import React from 'react'
import Layout from '../components/Layout'
import * as Yup from 'yup'
import { useMutation, gql } from '@apollo/client'
import Swal from 'sweetalert2'
import { useRouter } from 'next/router'

const LOGIN = gql`
    mutation LoginMutation($input: LoginInput!) {
        login(input: $input) {
            userId
            jwt            
        }
}
`

const Login = () => {

    const router = useRouter();

    const [ login ] = useMutation(LOGIN);

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('El email no es valido').required('El email no puede ir vacio'),
            password: Yup.string().required('El password es obligatorio')
        }),
        onSubmit: async valores => {
            //console.log(valores);
            const { email, password } = valores;
            try {
               const { data } = await login ({
                    variables: {
                        input: {
                            email,
                            password
                        }
                    }
                });
                console.log(data);
                // guardar token jwt en local storage
                 const { jwt, userId } = data.login;
                 localStorage.setItem('jwt', jwt);
                 localStorage.setItem('userId', userId);

                //redireccionar
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
                <h1 className="text-center text-white text-2xl" >Login</h1>
                <div className="flex justify-center mt-5" >
                    <div className="w-full max-w-xl">
                        <form className="bg-white rounded sgadow-md px-8 pt-6 pb-8 mb-4"
                              onSubmit={formik.handleSubmit}  
                         >
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email"  >
                                    Email
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                                        leading-tight focus:outline-none focus:shadow-outline mb-5"
                                        id="email"
                                        type="email"
                                        placeholder="Email de usuario"
                                        onChange={ formik.handleChange }
                                        onBlur={ formik.handleBlur }
                                        value={ formik.values.email }
                                />
                                { formik.touched.email && formik.errors.email ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                        <p className="font-bold" >Error</p>
                                        <p>{ formik.errors.email }</p>
                                    </div>
                                ) : null }

                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password"  >
                                    Contraseña
                                </label>
                                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                                        leading-tight focus:outline-none focus:shadow-outline"
                                        id="password"
                                        type="password"
                                        placeholder="Contraseña de usuario"
                                        onChange={ formik.handleChange }
                                        onBlur={ formik.handleBlur }
                                        value={ formik.values.password }
                                />

                                { formik.touched.password && formik.errors.password ? (
                                    <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" >
                                        <p className="font-bold" >Error</p>
                                        <p>{ formik.errors.password }</p>
                                    </div>
                                ) : null }

                            </div>
                            <input type="submit"
                                   className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                                   value="Iniciar Sesion" 
                                />
                        </form>

                    </div>

                </div>
            </Layout>            
        </>
    )
}

export default Login
