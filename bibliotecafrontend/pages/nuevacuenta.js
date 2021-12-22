import { useFormik } from "formik";
import React, { useEffect } from "react";
import Layout from "../components/Layout";
import * as Yup from "yup";
import { useMutation, gql } from "@apollo/client";
import { useRouter } from "next/router";
import Swal from "sweetalert2";

const NUEVO_USUARIO = gql`
  mutation Mutation($input: UserInput!) {
    register(input: $input) {
      id
      fullName
      email
    }
  }
`;

const NuevaCuenta = () => {
  const router = useRouter();

  //Mutation para crear un nuevo usuario
  const [register] = useMutation(NUEVO_USUARIO);

  //Validacion del Formulario
  const formik = useFormik({
    initialValues: {
      nombre: "",
      apellido: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required("El nombre es obligatorio"),
      apellido: Yup.string().required("el apellido es obligatorio"),
      email: Yup.string()
        .email("El email no es valido")
        .required("El email es obligatorio"),
      password: Yup.string()
        .required("La contraseña no puede ir vacia")
        .min(8, "La contraseña debe de tener un minimo de 8 caracteres"),
    }),
    onSubmit: async (valores) => {
      //console.log(valores);
      const { nombre, email, password } = valores;
      try {
        const { data } = await register({
          variables: {
            input: {
              fullName: nombre,
              email,
              password,
            },
          },
        });
        //console.log(data);
        Swal.fire({
          icon: "success",
          title: "OK",
          text: `Se registro el usuario ${data.register.fullName} correctamente , inicie sesion con sus credenciales`,
        });
        router.push("/login");
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

  return (
    <>
      <Layout>
        <h1 className="text-center text-white text-2xl">
          Nuevo registro de usuario
        </h1>
        <div className="flex justify-center mt-5">
          <div className="w-full max-w-xl">
            <form
              className="bg-white rounded sgadow-md px-8 pt-6 pb-8 mb-4"
              onSubmit={formik.handleSubmit}
            >
              <div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="nombre"
                >
                  Nombre
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                                        leading-tight focus:outline-none focus:shadow-outline mb-5"
                  id="nombre"
                  type="text"
                  placeholder="Ingrese su nombre"
                  value={formik.values.nombre}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.nombre && formik.errors.nombre ? (
                  <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                    <p className="font-bold">Error</p>
                    <p>{formik.errors.nombre}</p>
                  </div>
                ) : null}

                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="apellido"
                >
                  Apellido
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                                        leading-tight focus:outline-none focus:shadow-outline mb-5"
                  id="apellido"
                  type="text"
                  placeholder="Ingrese su apellido"
                  value={formik.values.apellido}
                  onChange={formik.handleChange}
                />
                {formik.touched.apellido && formik.errors.apellido ? (
                  <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                    <p className="font-bold">Error</p>
                    <p>{formik.errors.apellido}</p>
                  </div>
                ) : null}

                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                                        leading-tight focus:outline-none focus:shadow-outline mb-5"
                  id="email"
                  type="email"
                  placeholder="Email de usuario"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                    <p className="font-bold">Error</p>
                    <p>{formik.errors.email}</p>
                  </div>
                ) : null}

                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Contraseña
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 
                                        leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="Contraseña de usuario"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className="my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                    <p className="font-bold">Error</p>
                    <p>{formik.errors.password}</p>
                  </div>
                ) : null}
              </div>
              <input
                type="submit"
                className="bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900 cursor-pointer"
                value="Registrar nuevo usuario"
              />
            </form>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default NuevaCuenta;
