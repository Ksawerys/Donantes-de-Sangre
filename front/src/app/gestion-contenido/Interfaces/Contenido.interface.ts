//Todo Isa
export interface Contenido {
  titulo: string,
  subtitulo: string,
  contenido: string,
  seccion: string,
  imagen: any
}
export interface Response{
  success: boolean,
  data: Noticia[],
  msg: string,
}
export interface ResponseNoticia{
  success: boolean,
  data: Noticia,
  msg: string,
}
export interface Noticia {
  id: string,
  titulo: string
  subtitulo: string,
  contenido: string,
  seccion: string,
  fecha: Date,
  imagen: string
}
