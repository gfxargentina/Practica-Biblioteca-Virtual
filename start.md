### inicio de un proyecto node

-npm i init -y

### instalacion de modulos para trabajar con graphql typescript mysql etc

-npm i express apollo-server-express mysql typeorm reflect-metadata type-graphql

### instalacion de modulos usados solo cuando estamos desarrollando

-npm i -D typescript ts-node @types/express @types/node nodemon

### Crea Archivo de configuracion de typescript

-npx tsc --init

-descomentar la opcion outDir , que es donde guardaremos el codigo compilado
-descomentar la opcion rootDir, indica donde sacar el codigo que se va a compilar
-descomentar experimentalDecorators: true ,nos permite utilizar typeorm
-descomentar emitDecoratorMetadata : true, ""

### archivo package,json

-agregar en script: "start:dev": "nodemon src/main.ts --exec ts-node" ,exec ejecuta ts-node que es el paquete de typescript para node, ejecuta codigo typescript directamente sin compilarlo
