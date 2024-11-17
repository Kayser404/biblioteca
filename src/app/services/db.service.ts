import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';

import { Usuarios } from './usuarios';
import { Categoria } from './categoria';
import { Publicacion } from './publicacion';
import { Comentarios } from './comentarios';
import { Favorito } from './favorito';
import { Rol } from './rol';
import { PreguntaRespuesta } from './pregunta-respuesta';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  fetchLibros() {
    throw new Error('Method not implemented.');
  }
  fetchPublicacion() {
    throw new Error('Method not implemented.');
  }
  //Variable para la conexion de BD
  public database!: SQLiteObject;

  // Variables de creación de tablas

  tablaRol: string = `
    CREATE TABLE IF NOT EXISTS Rol (
      id_rol INTEGER PRIMARY KEY AUTOINCREMENT,
      nombreRol TEXT
    );
  `;
  tablaUsuario: string = `
    CREATE TABLE IF NOT EXISTS Usuario (
      id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      password TEXT,
      nombreUsuario TEXT,
      apellidoUsuario TEXT,
      edadUsuario VARCHAR(10),
      id_rolFK INTEGER NULL,
      FOREIGN KEY (id_rolFK) REFERENCES Rol(id_rol)
    );
  `;

  tablaCategoria: string = `
    CREATE TABLE IF NOT EXISTS Categoria (
      id_categoria INTEGER PRIMARY KEY AUTOINCREMENT,
      nombreCategoria TEXT
    );
  `;

  tablaPublicacion: string = `
    CREATE TABLE IF NOT EXISTS Publicacion (
      id_publicacion INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT,
      sinopsis TEXT,
      fechaPublicacion DATE,
      foto TEXT,
      pdf TEXT,
      estado TEXT DEFAULT 'pendiente',
      observacion TEXT DEFAULT NULL,
      id_usuarioFK INTEGER,
      id_categoriaFK INTEGER,
      FOREIGN KEY (id_usuarioFK) REFERENCES Usuario(id_usuario),
      FOREIGN KEY (id_categoriaFK) REFERENCES Categoria(id_categoria)
    );
  `;

  tablaComentario: string = `
    CREATE TABLE IF NOT EXISTS Comentarios (
      id_comentario INTEGER PRIMARY KEY AUTOINCREMENT,
      fechaComentario DATE,
      texto TEXT,
      id_usuarioFK INTEGER,
      id_publicacionFK INTEGER,
      FOREIGN KEY (id_usuarioFK) REFERENCES Usuario(id_usuario),
      FOREIGN KEY (id_publicacionFK) REFERENCES Publicacion(id_publicacion)
    );
  `;

  tablaFavorito: string = `
    CREATE TABLE IF NOT EXISTS Favorito (
      id_favorito INTEGER PRIMARY KEY AUTOINCREMENT,
      id_usuarioFK INTEGER,
      id_publicacionFK INTEGER,
      FOREIGN KEY (id_usuarioFK) REFERENCES Usuario(id_usuario),
      FOREIGN KEY (id_publicacionFK) REFERENCES Publicacion(id_publicacion)
    );
  `;

  tablaPreguntaRespuesta: string = `
    CREATE TABLE IF NOT EXISTS PreguntaRespuesta (
      id_pregunta_respuesta INTEGER PRIMARY KEY AUTOINCREMENT,
      pregunta TEXT,
      respuesta TEXT,
      id_usuarioFK INTEGER,
      FOREIGN KEY (id_usuarioFK) REFERENCES Usuario(id_usuario)
    );
  `;

  // Insertar Roles
  rolAdmin: string =
    "INSERT or IGNORE INTO Rol (id_rol, nombreRol) VALUES ('1', 'admin')";

  usuarioAdmin: string =
    "INSERT OR IGNORE INTO Usuario (id_usuario, email, password, nombreUsuario, apellidoUsuario, edadUsuario, id_rolFK) VALUES ('1', 'admin@example.com', 'admin123', 'Admin', 'User', 30, '1' );";

  //Insertar Categoria
  categoriaDrama: string =
    "INSERT or IGNORE INTO Categoria (id_categoria, nombreCategoria) VALUES ('1', 'Drama')";
  categoriaFantasia: string =
    "INSERT or IGNORE INTO Categoria (id_categoria, nombreCategoria) VALUES ('2', 'Fantasia')";
  categoriaTerror: string =
    "INSERT or IGNORE INTO Categoria (id_categoria, nombreCategoria) VALUES ('3', 'Terror')";
  categoriaRomance: string =
    "INSERT or IGNORE INTO Categoria (id_categoria, nombreCategoria) VALUES ('4', 'Romance')";

  // creacion observables para las tablas que se consultaran
  listaRol = new BehaviorSubject([]);
  listaUsuarios = new BehaviorSubject([]);
  listaPublicacion = new BehaviorSubject([]);
  listaCategoria = new BehaviorSubject([]);
  listaComentario = new BehaviorSubject([]);
  listaFavorito = new BehaviorSubject([]);
  listaPreguntaRespuesta = new BehaviorSubject([]);

  //observable para manipular el status de la BD
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private alertController: AlertController,
    public sqlite: SQLite,
    private platform: Platform
  ) {
    this.crearBD();
  }

  // Observable for DB status
  dbState() {
    return this.isDBReady.asObservable();
  }

  /*------------- Consultas -------------------------------------*/
  /* ROL */
  fetchRol(): Observable<Rol[]> {
    return this.listaRol.asObservable();
  }
  buscarRol() {
    //retorno el resultado de la consulta
    return this.database.executeSql('SELECT * FROM ROL', []).then((res) => {
      //la consulta se realizó correctamente
      //creamos una variable para almacenar los registros del select
      let items: Rol[] = [];
      //validar cuantos registros vienen en el select
      if (res.rows.length > 0) {
        //recorro la consulta dentro del res
        for (var i = 0; i < res.rows.length; i++) {
          //alamaceno los registros en items
          items.push({
            idRol: res.rows.item(i).id_rol,
            nombreRol: res.rows.item(i).nombreRol,
          });
        }
      }
      this.listaRol.next(items as any);
    });
  }
  /* Usuario */
  fetchUsuario(): Observable<Usuarios[]> {
    return this.listaUsuarios.asObservable();
  }
  buscarUsuario() {
    //retorno el resultado de la consulta
    return this.database.executeSql('SELECT * FROM Usuario', []).then((res) => {
      //la consulta se realizó correctamente
      //creamos una variable para almacenar los registros del select
      let items: Usuarios[] = [];
      //validar cuántos registros vienen en el select
      if (res.rows.length > 0) {
        //recorro la consulta dentro del res
        for (var i = 0; i < res.rows.length; i++) {
          //alamaceno los registros en items
          items.push({
            idUsuario: res.rows.item(i).id_usuario,
            email: res.rows.item(i).email,
            password: res.rows.item(i).password,
            nombreUsuario: res.rows.item(i).nombreUsuario,
            apellidoUsuario: res.rows.item(i).apellidoUsuario,
            edadUsuario: res.rows.item(i).edadUsuario,
            rolFK: res.rows.item(i).id_rolFK,
            // Agrega más propiedades aquí si las has definido en la tabla
          });
        }
      }
      this.listaUsuarios.next(items as any);
    });
  }
  registrarUsuario(
    email: any,
    password: any,
    nombreUsuario: any,
    apellidoUsuario: any,
    edadUsuario: any
  ) {
    return this.database
      .executeSql(
        'INSERT INTO Usuario (email, password, nombreUsuario, apellidoUsuario, edadUsuario) VALUES (?, ?, ?, ?, ?)',
        [email, password, nombreUsuario, apellidoUsuario, edadUsuario]
      )
      .then(async (res) => {
        // Verificar si la inserción tuvo éxito
        if (res.rowsAffected > 0) {
          // La inserción tuvo éxito, muestra alerta de éxito
          await this.presentAlert('La inserción fue exitosa');
          const idUsuario = res.insertId;
          this.buscarUsuario(); // Si tienes una función para buscar usuarios
          return idUsuario;
        } else {
          // La inserción no tuvo éxito, muestra alerta de error
          await this.presentAlert('Hubo un problema al insertar el usuario.');
          return null;
        }
      })
      .catch(async (error) => {
        // Muestra alerta si ocurre un error
        console.error('Error al insertar', error);
        await this.presentAlert('Error al insertar: ' + error.message);
        return null;
      });
  }
  verificarCredenciales(email: string, password: string) {
    if (!email || !password) {
      return Promise.reject('Email o contraseña no válidos');
    }

    return this.database
      .executeSql(
        'SELECT id_usuario, email, password , id_rolFK FROM Usuario WHERE email = ? AND password = ?',
        [email, password]
      )

      .then((res) => {
        if (res.rows.length > 0) {
          // Retornar el usuario con rol incluido
          const usuario = {
            id_usuario: res.rows.item(0).id_usuario,
            email: res.rows.item(0).email,
            rolFK: res.rows.item(0).id_rolFK,
          };
          return usuario;
        } else {
          // No se encontraron resultados
          return null;
        }
      })
      .catch((err) => {
        // Capturar errores en la consulta
        console.error('Error en la base de datos:', err);
        return Promise.reject('Error en la base de datos');
      });
  }
  obtenerUsuarioPorId(idUsuario: any): Promise<any> {
    return this.database
      .executeSql('SELECT * FROM Usuario WHERE id_usuario = ?', [idUsuario])
      .then((res) => {
        if (res.rows.length > 0) {
          return {
            idUsuario: res.rows.item(0).id_usuario,
            email: res.rows.item(0).email,
            password: res.rows.item(0).password,
            nombreUsuario: res.rows.item(0).nombreUsuario,
            apellidoUsuario: res.rows.item(0).apellidoUsuario,
            edadUsuario: res.rows.item(0).edadUsuario,
            // Agrega más propiedades aquí si las has definido en la tabla
          };
        } else {
          return null; // Si no se encuentra el usuario
        }
      })
      .catch((error) => {
        console.error('Error al obtener los datos del usuario:', error);
        return null;
      });
  }
  actualizarUsuario(usuario: any, cambios: string[]): Promise<any> {
    // Inicializa el arreglo de parámetros
    const params: any[] = [];
    
    // Prepara las cláusulas SET y los parámetros
    const setClauses = [];
  
    // Aquí mapeas cada campo manualmente
    if (cambios.includes('nombreUsuario')) {
      setClauses.push('nombreUsuario = ?');
      params.push(usuario.nombreUsuario);
    }
    if (cambios.includes('apellidoUsuario')) {
      setClauses.push('apellidoUsuario = ?');
      params.push(usuario.apellidoUsuario);
    }
    if (cambios.includes('email')) {
      setClauses.push('email = ?');
      params.push(usuario.email);
    }
    if (cambios.includes('edadUsuario')) {
      setClauses.push('edadUsuario = ?');
      params.push(usuario.edadUsuario);
    }
    if (cambios.includes('password')) {
      setClauses.push('password = ?');
      params.push(usuario.password);
    }
  
    // Aquí agregamos el ID del usuario para la condición WHERE
    params.push(usuario.idUsuario);
  
    // Construir la consulta SQL
    const query = `
      UPDATE Usuario
      SET ${setClauses.join(', ')}
      WHERE id_usuario = ?;
    `;
  
    return this.database
      .executeSql(query, params)
      .then(() => {
        console.log('Usuario actualizado correctamente.');
        return true;
      })
      .catch((error) => {
        console.error('Error al actualizar el usuario:', error);
        return false;
      });
  }   

  /* PreguntaRespuesta */
  fetchPreguntaRespuesta(): Observable<PreguntaRespuesta[]> {
    return this.listaPreguntaRespuesta.asObservable();
  }
  buscarPreguntaRespuesta() {
    //retorno el resultado de la consulta
    return this.database
      .executeSql('SELECT * FROM PREGUNTARESPUESTA', [])
      .then((res) => {
        //la consulta se realizó correctamente
        //creamos una variable para almacenar los registros del select
        let items: PreguntaRespuesta[] = [];
        //validar cuantos registros vienen en el select
        if (res.rows.length > 0) {
          //recorro la consulta dentro del res
          for (var i = 0; i < res.rows.length; i++) {
            //alamaceno los registros en items
            items.push({
              idPregunta: res.rows.item(i).id_pregunta_respuesta,
              pregunta: res.rows.item(i).pregunta,
              respuesta: res.rows.item(i).respuesta,
              usuarioFK: res.rows.item(i).id_usuarioFK,
            });
          }
        }
        this.listaPreguntaRespuesta.next(items as any);
      });
  }
  agregarPreguntaRespuesta(pregunta: any, respuesta: any, usuarioFK: any) {
    console.log(
      'Intentando agregar pregunta y respuesta para ID de usuario:',
      usuarioFK
    );
    return this.database
      .executeSql(
        'INSERT INTO PREGUNTARESPUESTA (PREGUNTA, RESPUESTA, ID_USUARIOFK) VALUES (?, ?, ?)',
        [pregunta, respuesta, usuarioFK]
      )
      .then((res) => {
        this.buscarPreguntaRespuesta();
      });
  }
  /* Publicaciones */
  fetchCategoria(): Observable<Categoria[]> {
    return this.listaCategoria.asObservable();
  }
  buscarCategoria() {
    //retorno el resultado de la consulta
    return this.database
      .executeSql('SELECT * FROM Categoria', [])
      .then((res) => {
        //la consulta se realizó correctamente
        //creamos una variable para almacenar los registros del select
        let items: Categoria[] = [];
        //validar cuantos registros vienen en el select
        if (res.rows.length > 0) {
          //recorro la consulta dentro del res
          for (var i = 0; i < res.rows.length; i++) {
            //alamaceno los registros en items
            items.push({
              idCategoria: res.rows.item(i).id_categoria,
              nombreCategoria: res.rows.item(i).nombreCategoria,
            });
          }
        }
        this.listaCategoria.next(items as any);
      });
  }

  /* Publicaciones */
  fetchPublicaciones(): Observable<Publicacion[]> {
    return this.listaPublicacion.asObservable();
  }
  buscarPublicacion() {
    //retorno el resultado de la consulta
    return this.database
      .executeSql('SELECT * FROM Publicacion p INNER JOIN Usuario u ON p.id_usuarioFK = u.id_usuario', [])
      .then((res) => {
        //la consulta se realizó correctamente
        //creamos una variable para almacenar los registros del select
        let items: Publicacion[] = [];
        //validar cuantos registros vienen en el select
        if (res.rows.length > 0) {
          //recorro la consulta dentro del res
          for (var i = 0; i < res.rows.length; i++) {
            //alamaceno los registros en items
            items.push({
              idPublicacion: res.rows.item(i).id_publicacion,
              titulo: res.rows.item(i).titulo,
              sinopsis: res.rows.item(i).sinopsis,
              fechaPublicacion: res.rows.item(i).fechaPublicacion,
              foto: res.rows.item(i).foto,
              pdf: res.rows.item(i).pdf,
              estado: res.rows.item(i).estado,
              observacion: res.rows.item(i).observacion,
              usuarioFK: res.rows.item(i).id_usuarioFK,
              categoriaFK: res.rows.item(i).id_categoriaFK,
              // Campos de Usuario
              nombreAutor: res.rows.item(i).nombreUsuario,
              apellidoAutor: res.rows.item(i).apellidoUsuario,
            });
          }
        }
        this.listaPublicacion.next(items as any);
      });
  }
  
  agregarPublicacion(
    titulo: any,
    sinopsis: any,
    fechaPublicacion: any,
    foto: any,
    pdfUrl: any,
    usuarioFK: any,
    categoriaFK: any
  ) {
    console.log('Intentando agregar publicación');
    return this.database
      .executeSql(
        'INSERT INTO Publicacion (titulo, sinopsis, fechaPublicacion, foto, pdf, id_usuarioFK, id_categoriaFK) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          titulo,
          sinopsis,
          fechaPublicacion,
          foto,
          pdfUrl,
          usuarioFK,
          categoriaFK,
        ]
      )
      .then((res) => {
        this.buscarPublicacion();
        console.log(
          'Publicación agregada correctamente con estado predeterminado'
        );
      });
  }

  obtenerPublicacionUsuario(idUsuario: any) {
    return this.database
      .executeSql('SELECT * FROM Publicacion WHERE id_usuarioFK = ?', [
        idUsuario,
      ])
      .then((res) => {
        if (res.rows.length > 0) {
          const publicaciones = [];
          for (let i = 0; i < res.rows.length; i++) {
            publicaciones.push({
              idPublicacion: res.rows.item(i).id_publicacion,
              titulo: res.rows.item(i).titulo,
              sinopsis: res.rows.item(i).sinopsis,
              fechaPublicacion: res.rows.item(i).fechaPublicacion,
              foto: res.rows.item(i).foto,
              pdf: res.rows.item(i).pdf,
              estado: res.rows.item(i).estado,
              usuarioFK: res.rows.item(i).id_usuarioFK,
              categoriaFK: res.rows.item(i).id_categoriaFK,
            });
          }
          return publicaciones; // Devuelve todas las publicaciones del usuario
        } else {
          return null; // Si no hay publicaciones
        }
      })
      .catch((error) => {
        console.error('Error al obtener las publicaciones del usuario:', error);
        return null;
      });
  }
  // Método para actualizar una publicación
  actualizarPublicacion(
    titulo: any,
    sinopsis: any,
    foto: any,
    pdf: any,
    categoriaFK: any,
    idPublicacion: any
  ): Promise<any> {
    return this.database
      .executeSql(
        'UPDATE Publicacion SET titulo = ?, sinopsis = ?, foto = ?, pdf = ?, id_categoriaFK = ? WHERE id_publicacion = ?;',
        [titulo, sinopsis, foto, pdf, categoriaFK, idPublicacion]
      )
      .then(() => {
        console.log('Publicación actualizada correctamente');
        this.buscarPublicacion();
        return true;
      })
      .catch((error) => {
        console.error('Error al actualizar la publicación:', error);
        return false;
      });
  }
  // Método para obtener una publicación por su ID
  obtenerPublicacionPorId(idPublicacion: any): Promise<any> {
    return this.database
      .executeSql('SELECT * FROM Publicacion WHERE id_publicacion = ?', [
        idPublicacion,
      ])
      .then((res) => {
        if (res.rows.length > 0) {
          // Si se encuentra la publicación, devolvemos el objeto con sus datos
          return {
            idPublicacion: res.rows.item(0).id_publicacion,
            titulo: res.rows.item(0).titulo,
            sinopsis: res.rows.item(0).sinopsis,
            fechaPublicacion: res.rows.item(0).fechaPublicacion,
            foto: res.rows.item(0).foto,
            pdf: res.rows.item(0).pdf,
            usuarioFK: res.rows.item(0).id_usuarioFK,
            categoriaFK: res.rows.item(0).id_categoriaFK,
          };
        } else {
          // Si no se encuentra ninguna publicación con ese ID
          return null;
        }
      })
      .catch((error) => {
        console.error('Error al obtener la publicación por ID:', error);
        return null;
      });
  }
  // Método para modificar el estado de la publicación
  aprobarRechazarPublicacionPorId(
    idPublicacion: number,
    estado: string,
    observacion: string,
  ): Promise<boolean> {
    return this.database
      .executeSql(
        'UPDATE Publicacion SET estado = ?, observacion = ? WHERE id_publicacion = ?;',
        [estado, observacion, idPublicacion]
      )
      .then(() => {
        console.log(`Publicación ${estado} correctamente`);
        this.buscarPublicacion(); // Refresca la lista de publicaciones después de la actualización
        return true;
      })
      .catch((error) => {
        console.error(
          `Error al cambiar el estado de la publicación a ${estado}:`,
          error
        );
        return false;
      });
  }
  // Metodo para eliminar publicacion
  eliminarPublicacionPorId(idPublicacion: number): Promise<boolean> {
    return this.database
      .executeSql('DELETE FROM Publicacion WHERE id_publicacion = ?;', [
        idPublicacion,
      ])
      .then(() => {
        console.log('Publicación eliminada correctamente');
        this.buscarPublicacion(); // Refresca la lista de publicaciones después de eliminar
        return true;
      })
      .catch((error) => {
        console.error('Error al eliminar la publicación:', error);
        return false;
      });
  }

  /* Favorito */
  fetchFavorito(): Observable<Favorito[]> {
    return this.listaFavorito.asObservable();
  }
  buscarFavorito() {
    //retorno el resultado de la consulta
    return this.database
      .executeSql('SELECT * FROM Publicacion', [])
      .then((res) => {
        //la consulta se realizó correctamente
        //creamos una variable para almacenar los registros del select
        let items: Favorito[] = [];
        //validar cuantos registros vienen en el select
        if (res.rows.length > 0) {
          //recorro la consulta dentro del res
          for (var i = 0; i < res.rows.length; i++) {
            //alamaceno los registros en items
            items.push({
              idFavorito: res.rows.item(i).id_favorito,
              idUsuarioFK: res.rows.item(i).id_usuarioFK,
              idPublicacionFK: res.rows.item(i).id_publicacionFK,
            });
          }
        }
        this.listaFavorito.next(items as any);
      });
  }
  // Método para agregar un libro a favoritos
  agregarAFavoritos(idUsuario: any, idPublicacion: any) {
    return this.database
      .executeSql(
        'INSERT INTO Favorito (id_usuarioFK, id_publicacionFK) VALUES (?, ?);',
        [idUsuario, idPublicacion]
      )
      .then(() => {
        this.buscarFavorito();
        console.log('Libro agregado a favoritos en la base de datos.');
        return true;
      })
      .catch((error) => {
        console.error(
          'Error al agregar el libro a favoritos en la base de datos:',
          error
        );
        return false;
      });
  }
  // Método para eliminar un libro de los favoritos de un usuario
  quitarDeFavoritos(idUsuario: any, idPublicacion: any): Promise<any> {
    return this.database
      .executeSql(
        'DELETE FROM Favorito WHERE id_usuarioFK = ? AND id_publicacionFK = ?;',
        [idUsuario, idPublicacion]
      )
      .then(() => {
        console.log('Libro eliminado de favoritos.');
        this.buscarFavorito();
        return true;
      })
      .catch((error) => {
        console.error('Error al eliminar el libro de favoritos:', error);
        return false;
      });
  }
  obtenerFavoritoUsuario(idUsuario: any): Promise<Favorito[]> {
    return this.database
      .executeSql('SELECT * FROM Favorito WHERE id_usuarioFK = ?', [idUsuario])
      .then((res) => {
        let items: Favorito[] = [];

        if (res.rows.length > 0) {
          for (let i = 0; i < res.rows.length; i++) {
            items.push({
              idFavorito: res.rows.item(i).id_favorito,
              idUsuarioFK: res.rows.item(i).id_usuarioFK,
              idPublicacionFK: res.rows.item(i).id_publicacionFK,
            });
          }
        }
        this.buscarFavorito();
        return items;
      })
      .catch((error) => {
        // Mostrar más detalles del error en la consola
        console.error(
          'Error al obtener los favoritos del usuario:',
          JSON.stringify(error)
        );
        return [];
      });
  }

  // Obtener comentarios para una publicación específica
  obtenerComentarios(idPublicacion: number): Promise<any[]> {
    return this.database.executeSql(
      'SELECT c.*, u.nombreUsuario FROM Comentarios c JOIN Usuario u ON c.id_usuarioFK = u.id_usuario WHERE c.id_publicacionFK = ? ORDER BY c.fechaComentario DESC',
      [idPublicacion]
    ).then(data => {
      let comentarios = [];
      for (let i = 0; i < data.rows.length; i++) {
        comentarios.push(data.rows.item(i));
      }
      return comentarios;
    });
  }

  // Agregar un nuevo comentario
  agregarComentario(idPublicacion: number, idUsuario: number, texto: string): Promise<void> {
    const fechaComentario = new Date().toISOString();
    return this.database.executeSql(
      'INSERT INTO Comentarios (fechaComentario, texto, id_usuarioFK, id_publicacionFK) VALUES (?, ?, ?, ?)',
      [fechaComentario, texto, idUsuario, idPublicacion]
    );
  }

  // Actualizar un comentario (para administrador)
  actualizarComentario(idComentario: number, nuevoTexto: string): Promise<void> {
    return this.database.executeSql(
      'UPDATE Comentarios SET texto = ? WHERE id_comentario = ?',
      [nuevoTexto, idComentario]
    );
  }










  /*-------------------- CONFIG.BASE DE DATOS ---------------------*/
  crearBD() {
    //verifico si la plataforma está lista
    this.platform.ready().then(() => {
      //crear la BD
      this.sqlite
        .create({
          name: 'biblioteca.db',
          location: 'default',
        })
        .then((db: SQLiteObject) => {
          //guardo la conexión a BD en mi variable
          this.database = db;
          //llamo a la creación de las tablas
          this.crearTablas();
          this.presentAlert('Bd Creada con exito');
        })
        .catch((e) => {
          this.presentAlert('Error en crear BD: ' + e);
        });
    });
  }

  async crearTablas() {
    try {
      // Crear tablas en el orden correcto
      await this.database.executeSql(this.tablaRol, []); // 1
      await this.database.executeSql(this.tablaUsuario, []); // 2
      await this.database.executeSql(this.tablaCategoria, []); // 3
      await this.database.executeSql(this.tablaPublicacion, []); // 4
      await this.database.executeSql(this.tablaComentario, []); // 5
      await this.database.executeSql(this.tablaFavorito, []); // 6
      await this.database.executeSql(this.tablaPreguntaRespuesta, []); // 7

      // Insertar registros
      await this.database.executeSql(this.rolAdmin, []);
      await this.database.executeSql(this.categoriaDrama, []);
      await this.database.executeSql(this.categoriaFantasia, []);
      await this.database.executeSql(this.categoriaRomance, []);
      await this.database.executeSql(this.categoriaTerror, []);

      // usuario de prueba
      await this.database.executeSql(this.usuarioAdmin, []);

      // Actualizar el estado de la base de datos
      this.isDBReady.next(true);

      // Buscar datos iniciales
      this.buscarUsuario();
      this.buscarRol();
      this.buscarPreguntaRespuesta();
      this.buscarCategoria();
      this.buscarPublicacion();
      this.buscarFavorito();
    } catch (e) {
      console.log('Error en crear Tabla:', e); // Mostrar error en consola para más detalles
      this.presentAlert('Error en crear Tabla: ' + JSON.stringify(e)); // Mostrar error detallado en un alert
    }
  }

  async presentAlert(msj: string) {
    const alert = await this.alertController.create({
      header: 'Usuarios, saluden a Blackend',
      message: msj,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
