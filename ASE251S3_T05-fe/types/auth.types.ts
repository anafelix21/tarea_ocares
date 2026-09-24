export interface Usuario {
  id?: string;
  nombre: string;
  apellido: string;
  correo: string;
  password?: string;
  rol: 'ADMIN' | 'SUPERVISOR' | 'OPERADOR' | 'SUPERVISOR_ALMACEN';
  fechaNacimiento?: string;
  fechaContratacion?: string;
  estado?: boolean;
}

export interface AuthState {
  user: Usuario | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
