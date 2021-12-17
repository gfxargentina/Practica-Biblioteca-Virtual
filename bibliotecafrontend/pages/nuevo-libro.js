import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import * as Yup from "yup";
import { useMutation, gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import Swal from "sweetalert2";
import Select from "react-select";
import { GET_ALL_BOOKS } from ".";

//Query trae todos los autores

export const GET_AUTHORS = gql`
  query {
    getAllAuthors {
      id
      fullName
      createdAt
      books {
        id
        title
      }
    }
  }
`;

const NUEVO_LIBRO = gql`
  mutation CreateBook($input: BookInput!) {
    createBook(input: $input) {
      title
      author {
        fullName
      }
    }
  }
`;

const NuevoLibro = () => {
  const router = useRouter();

  //Consultar BD
  const { data, loading, error } = useQuery(GET_AUTHORS);
  //console.log(data);

  //Mutation para crear un nuevo usuario
  const [nuevoLibro] = useMutation(NUEVO_LIBRO, {
    refetchQueries: [{ query: GET_ALL_BOOKS }],
  });
  //console.log(data);

  //Validacion del Formulario
  const formik = useFormik({
    initialValues: {
      autor: "",
      titulo: "",
    },
    validationSchema: Yup.object({
      // autor: Yup.string().required('El nombre del autor es obligatorio'),
      titulo: Yup.string().required("el titulo es obligatorio"),
    }),
    onSubmit: async (valores) => {
      //console.log(valores);
      const { titulo } = valores;
      try {
        const { data } = await nuevoLibro({
          variables: {
            input: {
              title: titulo,
              author: autor,
            },
          },
        });
        //console.log(data);
        Swal.fire({
          icon: "success",
          title: "OK",
          text: "Se ingreso el libro correctamente",
        });
        router.push("/");
      } catch (error) {
        //console.log(error);
        Swal.fire({
          icon: "error",
          title: "Oops...Hubo un problema",
          text: `${error}`,
        });
      }
    },
  });

  //Select
  const [autor, setAutor] = useState([]);

  const seleccionarAutor = (opcion) => {
    //console.log(opcion.id);
    setAutor(opcion.id);
  };

  //resultados consulta useQuery
  if (loading) return null;

  const { getAllAuthors } = data;

  return (
    <>
      <Layout>
        <h1 className="text-center text-gray-800 text-2xl">
          Ingresar Nuevo Libro
        </h1>
        <div className="flex justify-center mt-5">
          <div className="w-full max-w-xl">
            <form
              className="bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4"
              onSubmit={formik.handleSubmit}
            >
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="nombre"
                >
                  Autor
                </label>
                <Select
                  options={getAllAuthors}
                  isMulti={false}
                  onChange={(opcion) => seleccionarAutor(opcion)}
                  getOptionValue={(opciones) => opciones.id}
                  getOptionLabel={(opciones) => opciones.fullName}
                  placeholder="Busque el autor aqui"
                  noOptionsMessage={() => "no hay Resultado"}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                                                leading-tight focus:outline-none focus:shadow-outline mb-5"
                />
                {/* <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                                        leading-tight focus:outline-none focus:shadow-outline mb-5"
                                        id="autor"
                                        type="text"
                                        placeholder="Ingrese el nombre del autor"
                                        value={formik.values.autor}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                /> */}
                {formik.touched.autor && formik.errors.autor ? (
                  <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                    <p className="font-bold">Error</p>
                    <p>{formik.errors.autor}</p>
                  </div>
                ) : null}

                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="apellido"
                >
                  Titulo
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                                        leading-tight focus:outline-none focus:shadow-outline mb-5"
                  id="titulo"
                  type="text"
                  placeholder="Ingrese el titulo del libro"
                  value={formik.values.titulo}
                  onChange={formik.handleChange}
                />
                {formik.touched.titulo && formik.errors.titulo ? (
                  <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                    <p className="font-bold">Error</p>
                    <p>{formik.errors.titulo}</p>
                  </div>
                ) : null}
              </div>
              <input
                type="submit"
                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                value="Guardar Libro"
              />
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default NuevoLibro;
