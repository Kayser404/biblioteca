import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';

import { Usuarios } from './usuarios';
import { Rol } from './rol';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  //Variable para la conexion de BD
  public database!: SQLiteObject;

  // Variables de creación de tablas
  tablaUsuario: string = `
    CREATE TABLE Usuario (
      email TEXT PRIMARY KEY,
      password TEXT,
      nombreUsuario TEXT,
      apellidoUsuario TEXT,
      edadUsuario INTEGER,
    );
  `;

  tablaCategoria: string = `
    CREATE TABLE Categoria (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombreCategoria TEXT
    );
  `;

  tablaPublicacion: string = `
    CREATE TABLE Publicacion (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT,
      sinopsis TEXT,
      fechaPublicacion DATE,
      foto TEXT,
      pdf TEXT,
      id_usuarioFK TEXT,
      id_categoriaFK INTEGER,
      FOREIGN KEY (id_usuarioFK) REFERENCES Usuario(email),
      FOREIGN KEY (id_categoriaFK) REFERENCES Categoria(id)
    );
  `;

  tablaComentario: string = `
    CREATE TABLE Comentarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fechaComentario DATE,
      texto TEXT,
      id_usuarioFK TEXT,
      id_publicacionFK INTEGER,
      FOREIGN KEY (id_usuarioFK) REFERENCES Usuario(email),
      FOREIGN KEY (id_publicacionFK) REFERENCES Publicacion(id)
    );
  `;

  tablaFavorito: string = `
    CREATE TABLE Favorito (
      id_usuarioFK TEXT,
      id_publicacionFK INTEGER,
      PRIMARY KEY (id_usuarioFK, id_publicacionFK),
      FOREIGN KEY (id_usuarioFK) REFERENCES Usuario(email),
      FOREIGN KEY (id_publicacionFK) REFERENCES Publicacion(id)
    );
  `;

  tablaRol: string = `
    CREATE TABLE Rol (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombreRol TEXT
    );
  `;

  tablaUsuarioRol: string = `
    CREATE TABLE UsuarioRol (
      id_usuarioFK TEXT,
      id_rolFK INTEGER,
      PRIMARY KEY (id_usuarioFK, id_rolFK),
      FOREIGN KEY (id_usuarioFK) REFERENCES Usuario(email),
      FOREIGN KEY (id_rolFK) REFERENCES Rol(id)
    );
  `;

  tablaPreguntaRespuesta: string = `
    CREATE TABLE PreguntaRespuesta (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pregunta TEXT,
      respuesta TEXT,
      id_usuarioFK TEXT,
      FOREIGN KEY (id_usuarioFK) REFERENCES Usuario(email)
    );
  `;

  // Insertar Roles
  rolAdmin: string = `INSERT INTO Rol (nombreRol) VALUES ('admin')`;
  rolAutor: string = `INSERT INTO Rol (nombreRol) VALUES ('lector')`;
  rolLector: string = `INSERT INTO Rol (nombreRol) VALUES ('autor')`;
  
  // creacion observables para las tablas que se consultaran
  listaUsuarios = new BehaviorSubject([]);
  listaPublicacion = new BehaviorSubject([]);
  listaCategoria = new BehaviorSubject([]);
  listaComentario = new BehaviorSubject([]);
  listaFavorito = new BehaviorSubject([]);
  listaRol = new BehaviorSubject([]);
  listaUsuarioRol = new BehaviorSubject([]);
  listaPreguntaRespuesta = new BehaviorSubject([]);
  
  //observable para manipular el status de la BD
  private isDBReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private alertController: AlertController,
    public sqlite: SQLite,
    private platform: Platform,
  
  ) {
    this.crearBD();
  }

  // Observable for DB status
  dbState() {
    return this.isDBReady.asObservable();
  }

/*------------- Consultas -------------------------------------*/
  /* Usuario */
  fetchUsuario(): Observable<Usuarios[]> {
    return this.listaUsuarios.asObservable();
  }
  buscarUsuario() {
    //retorno el resultado de la consulta
    return this.database.executeSql('SELECT * FROM Usuario', []).then(res => {
      //la consulta se realizó correctamente
      //creamos una variable para almacenar los registros del select
      let items: any[] = [];
      //validar cuántos registros vienen en el select
      if (res.rows.length > 0) {
        //recorro la consulta dentro del res
        for (var i = 0; i < res.rows.length; i++) {
          //alamaceno los registros en items
          items.push({
            email: res.rows.item(i).email,
            password: res.rows.item(i).password,
            nombreUsuario: res.rows.item(i).nombreUsuario,
            apellidoUsuario: res.rows.item(i).apellidoUsuario,
            edadUsuario: res.rows.item(i).edadUsuario
            // Agrega más propiedades aquí si las has definido en la tabla
          });
        }
      }
      this.listaUsuarios.next(items as any);
    });
  }
  registrarUsuario(email: string, password: string, nombreUsuario: string, apellidoUsuario: string, edadUsuario: number) {
    const query = `INSERT INTO Usuario (email, password, nombreUsuario, apellidoUsuario, edadUsuario) VALUES (?, ?, ?, ?, ?)`;
    
    return this.database.executeSql(query, [email, password, nombreUsuario, apellidoUsuario, edadUsuario])
      .then(() => {
        // Puedes realizar alguna acción después de registrar al usuario, como actualizar la lista de usuarios
        this.presentAlert('Usuario registrado con éxito');
      })
      .catch(e => {
        this.presentAlert('Error al registrar usuario: ' + e.message);
      });
  }
  /* ROL */
  fetchRol(): Observable<Rol[]> {
    return this.listaRol.asObservable();
  }
  buscarRol() {
    //retorno el resultado de la consulta
    return this.database.executeSql('SELECT * FROM ROL', []).then(res => {
      //la consulta se realizó correctamente
      //creamos una variable para almacenar los registros del select
      let items: Rol[] = [];
      //validar cuantos registros vienen en el select
      if (res.rows.length > 0) {
        //recorro la consulta dentro del res
        for (var i = 0; i < res.rows.length; i++) {
          //alamaceno los registros en items
          items.push({
            idRol: res.rows.item(i).idRol,
            nombreRol: res.rows.item(i).nombreRol,
          })
        }
      }
      this.listaRol.next(items as any);
    })
  }

/*-------------------- CONFIG.BASE DE DATOS ---------------------*/
  crearBD() {
    //verifico si la plataforma está lista
    this.platform.ready().then(() => {
      //crear la BD
      this.sqlite.create({
        name: 'bdadoptame.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        //guardo la conexión a BD en mi variable
        this.database = db;
        //llamo a la creación de las tablas
        this.crearTablas();
        /* this.presentAlert("Bd Creada con exito"); */
      }).catch(e => {
        /* this.presentAlert("Error en crear BD: " + e); */
      })
    })
  }

  async crearTablas() {
    try {
      // creamos las tablas
      await this.database.executeSql(this.tablaUsuario, []);
      await this.database.executeSql(this.tablaCategoria, []);
      await this.database.executeSql(this.tablaPublicacion, []);
      await this.database.executeSql(this.tablaComentario, []);
      await this.database.executeSql(this.tablaFavorito, []);
      await this.database.executeSql(this.tablaRol, []);
      await this.database.executeSql(this.tablaUsuarioRol, []);
      await this.database.executeSql(this.tablaPreguntaRespuesta, []);

      // Insertar registros
      await this.database.executeSql(this.rolAdmin, []);
      await this.database.executeSql(this.rolAutor, []);
      await this.database.executeSql(this.rolLector, []);

      //actualizamos el observable de la BD
      this.isDBReady.next(true);

      // Llamamos los buscar 
      this.buscarUsuario();
      this.buscarRol();

    } catch (e) {
      this.presentAlert("Error en crear Tabla: " + e);
    }
  }

  async presentAlert(msj: string) {
    const alert = await this.alertController.create({
      header: 'Usuarios, saluden a Backend',
      message: msj,
      buttons: ['OK'],
    });
    await alert.present();
  }
}