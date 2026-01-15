// interfaces q me pidieron en el ejercicio
interface IEstudiante {
  id: number;
  nombre: string;
  edad: number;
  carrera: string;
  activo: boolean;
  promedio: number;
}

interface IResultado<T> {
  ok: boolean;
  mensaje: string;
  data?: T;
}

// clase estudiante
class Estudiante implements IEstudiante {
  id: number;
  nombre: string;
  edad: number;
  carrera: string;
  activo: boolean;
  promedio: number;

  constructor(
    id: number,
    nombre: string,
    edad: number,
    carrera: string,
    activo: boolean,
    promedio: number
  ) {
    this.id = id;
    this.nombre = nombre;
    this.edad = edad;
    this.carrera = carrera;
    this.activo = activo;
    this.promedio = promedio;
  }
}

// sistema para manejar estudiantes
class SistemaEstudiantes {
  private estudiantes: Estudiante[];

  constructor() {
    this.estudiantes = [];
  }

  // para agregar un estudiante
  agregar(est: Estudiante): IResultado<Estudiante> {
    // ver si ya existe ese id
    for (let i = 0; i < this.estudiantes.length; i++) {
      let estudiante = this.estudiantes[i];
      if (estudiante && estudiante.id === est.id) {
        return { ok: false, mensaje: "Error: ID repetido" };
      }
    }

    // verificar edad
    if (est.edad < 15) {
      return { ok: false, mensaje: "Error: edad minima 15" };
    }
    if (est.edad > 80) {
      return { ok: false, mensaje: "Error: edad maxima 80" };
    }

    // verificar promedio
    if (est.promedio < 0) {
      return { ok: false, mensaje: "Error: promedio minimo 0" };
    }
    if (est.promedio > 10) {
      return { ok: false, mensaje: "Error: promedio maximo 10" };
    }

    // agregar al array
    this.estudiantes.push(est);
    return { ok: true, mensaje: "Estudiante agregado", data: est };
  }

  // devolver la lista completa
  listar(): Estudiante[] {
    return this.estudiantes;
  }

  // buscar estudiante
  buscarPorId(id: number): IResultado<Estudiante> {
    for (let i = 0; i < this.estudiantes.length; i++) {
      let estudiante = this.estudiantes[i];
      if (estudiante && estudiante.id === id) {
        return { ok: true, mensaje: "Encontrado", data: estudiante };
      }
    }
    return { ok: false, mensaje: "No encontrado" };
  }

  // actualizar promedio
  actualizarPromedio(id: number, nuevoPromedio: number): IResultado<Estudiante> {
    // validar primero
    if (nuevoPromedio < 0) {
      return { ok: false, mensaje: "Error: promedio minimo 0" };
    }
    if (nuevoPromedio > 10) {
      return { ok: false, mensaje: "Error: promedio maximo 10" };
    }

    // buscar y actualizar
    for (let i = 0; i < this.estudiantes.length; i++) {
      let estudiante = this.estudiantes[i];
      if (estudiante && estudiante.id === id) {
        estudiante.promedio = nuevoPromedio;
        return { ok: true, mensaje: "Promedio actualizado", data: estudiante };
      }
    }

    return { ok: false, mensaje: "Estudiante no existe" };
  }

  // cambiar estado
  cambiarEstado(id: number, activo: boolean): IResultado<Estudiante> {
    for (let i = 0; i < this.estudiantes.length; i++) {
      let estudiante = this.estudiantes[i];
      if (estudiante && estudiante.id === id) {
        estudiante.activo = activo;
        return { ok: true, mensaje: "Estado cambiado", data: estudiante };
      }
    }
    return { ok: false, mensaje: "Estudiante no existe" };
  }

  // listar activos nomas
  listarActivos(): Estudiante[] {
    let activos: Estudiante[] = [];
    for (let i = 0; i < this.estudiantes.length; i++) {
      let estudiante = this.estudiantes[i];
      if (estudiante && estudiante.activo === true) {
        activos.push(estudiante);
      }
    }
    return activos;
  }

  // calcular promedio general
  promedioGeneral(): number {
    if (this.estudiantes.length === 0) {
      return 0;
    }

    let suma = 0;
    for (let i = 0; i < this.estudiantes.length; i++) {
      let estudiante = this.estudiantes[i];
      if (estudiante) {
        suma = suma + estudiante.promedio;
      }
    }

    return suma / this.estudiantes.length;
  }
}

// ================= MENU INTERACTIVO =================

import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// mostrar menu
function mostrarMenu(): void {
  console.log("");
  console.log("=== MENU ===");
  console.log("1. Agregar estudiante");
  console.log("2. Listar estudiantes");
  console.log("3. Buscar por ID");
  console.log("4. Actualizar promedio");
  console.log("5. Cambiar estado");
  console.log("6. Listar activos");
  console.log("7. Promedio general");
  console.log("8. Salir");
  console.log("");
}

// ejecutar opciones
function ejecutarMenu(sistema: SistemaEstudiantes): void {
  mostrarMenu();

  rl.question("Seleccione una opcion: ", (opcion) => {
    switch (opcion) {
      case "1":
        rl.question("ID: ", (id) => {
          rl.question("Nombre: ", (nombre) => {
            rl.question("Edad: ", (edad) => {
              rl.question("Carrera: ", (carrera) => {
                rl.question("Promedio: ", (promedio) => {
                  let est = new Estudiante(
                    Number(id),
                    nombre,
                    Number(edad),
                    carrera,
                    true,
                    Number(promedio)
                  );
                  let res = sistema.agregar(est);
                  console.log(res.mensaje);
                  ejecutarMenu(sistema);
                });
              });
            });
          });
        });
        break;

      case "2":
        console.log(sistema.listar());
        ejecutarMenu(sistema);
        break;

      case "3":
        rl.question("Ingrese ID: ", (id) => {
          let res = sistema.buscarPorId(Number(id));
          console.log(res);
          ejecutarMenu(sistema);
        });
        break;

      case "4":
        rl.question("ID: ", (id) => {
          rl.question("Nuevo promedio: ", (prom) => {
            let res = sistema.actualizarPromedio(Number(id), Number(prom));
            console.log(res.mensaje);
            ejecutarMenu(sistema);
          });
        });
        break;

      case "5":
        rl.question("ID: ", (id) => {
          rl.question("Activo (true/false): ", (estado) => {
            let res = sistema.cambiarEstado(Number(id), estado === "true");
            console.log(res.mensaje);
            ejecutarMenu(sistema);
          });
        });
        break;

      case "6":
        console.log(sistema.listarActivos());
        ejecutarMenu(sistema);
        break;

      case "7":
        console.log("Promedio general:", sistema.promedioGeneral().toFixed(2));
        ejecutarMenu(sistema);
        break;

      case "8":
        console.log("Saliendo...");
        rl.close();
        break;

      default:
        console.log("Opcion invalida");
        ejecutarMenu(sistema);
        break;
    }
  });
}

// aca corre todo
let miSistema = new SistemaEstudiantes();
ejecutarMenu(miSistema);
