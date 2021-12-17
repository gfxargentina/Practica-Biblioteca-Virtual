import React from "react";
import Layout from "../../components/Layout";
import { useMutation, gql, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { GET_ALL_BOOKS } from "..";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { GET_ALL_LOANS } from "../libros-prestados";

const GET_BOOK_BY_ID = gql`
  query GetBookById($input: BookIdInput!) {
    getBookById(input: $input) {
      title
      author {
        fullName
      }
    }
  }
`;

const UPDATE_BOOK = gql`
  mutation UpdateBookByID($input: BookUpdateInput!, $bookId: BookIdInput!) {
    updateBookByID(input: $input, bookId: $bookId)
  }
`;

const ActualizarLibro = () => {
  const router = useRouter();

  //trae el id que le pasamos de index.js
  const { id } = router.query;
  //console.log(id);

  //Mutation para actualizar libro
  const [actualizarLibro] = useMutation(UPDATE_BOOK, {
    refetchQueries: [{ query: GET_ALL_BOOKS }, { query: GET_ALL_LOANS }],
  });

  // Formulario
  const formik = useFormik({
    initialValues: {
      titulo: "",
    },
    onSubmit: async (valores) => {
      //console.log(valores);
      const { titulo } = valores;
      try {
        const { data } = await actualizarLibro({
          variables: {
            input: {
              title: titulo,
            },
            bookId: { id: parseInt(id) },
          },
        });

        Swal.fire({
          icon: "success",
          title: "OK",
          text: "Se Actualizo el libro correctamente",
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

  const { data, loading, error } = useQuery(GET_BOOK_BY_ID, {
    variables: {
      input: {
        id: parseInt(id),
      },
    },
  });

  if (loading) return null;
  //console.log(data);

  return (
    <>
      <Layout>
        <div>
          <h1 className="text-center text-2xl text-gray-800 ">
            Libro a Actualizar
          </h1>
          <div className="flex justify-center mt-5">
            <form
              onSubmit={formik.handleSubmit}
              className="bg-white rounded shadow-md w-full max-w-xl px-8 pt-6 pb-8 mb-4"
            >
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="apellido"
              >
                Titulo
              </label>
              <input
                id="titulo"
                type="text"
                value={formik.values.titulo}
                onChange={formik.handleChange}
                placeholder={data.getBookById.title}
                className="placeholder-gray-900 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                                    leading-tight focus:outline-none focus:shadow-outline mb-5"
              ></input>

              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="autor"
              >
                Autor
              </label>
              <input
                id="autor"
                type="text"
                placeholder={data.getBookById.author.fullName}
                className="placeholder-gray-900 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                                    leading-tight focus:outline-none focus:shadow-outline mb-5"
              ></input>

              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="apellido"
              >
                Fecha de Actualizacion
              </label>
              <input
                id="fechaPrestamo"
                type="text"
                placeholder={dayjs().format("DD/MM/YYYY")}
                // value={formik.values.fechaPrestamo}
                // onChange={formik.handleChange}
                className="placeholder-green-500 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                                    leading-tight focus:outline-none focus:shadow-outline mb-5"
              ></input>

              <input
                type="submit"
                className="bg-gray-700 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900"
                value="Actualizar Libro"
              />
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ActualizarLibro;
