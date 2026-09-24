export * from './auth.types';

export interface Parcela {
  id?: string;
  nombre: string;
  ubicacion?: string;
  areaHectareas: number;
  tipoSuelo?: string;
  responsable?: string;
  estadoRiego?: string;
  fechaUltimaSiembra?: string;
  produccionEstimada?: string;
  cultivoActual?: string;
  observaciones?: string;
  enUso?: boolean;
  estado?: boolean;
}

export interface Insumo {
  id?: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  unidadMedida?: string;
  tipoInsumo?: string;
  proveedor?: string;
  presentacion?: string;
  estado?: boolean;
}

export interface Cultivo {
  idCultivo?: number;
  idParcela: string;
  nombre: string;
  tipoCultivo: string;
  frecuenciaRiegoDias: number;
  temperaturaIdeal: number;
  fechaSiembra?: string;
  requiereSombra?: boolean;
  observaciones?: string;
  estado?: boolean;
}

export interface FichaCampo {
  id?: string;
  idCultivo?: string;
  idUsuario?: string;
  fechaRegistro?: string;
  etapaFenologica: string;
  temperaturaAmb?: number;
  humedadRelativa?: number;
  condicionClima?: string;
  estadoCultivo: string;
  necesitaRiego?: boolean;
  necesitaFumigacion?: boolean;
  diagnostico?: string;
  accionTomada?: string;
  estado?: boolean;
}

export interface MovimientoInsumo {
  id?: string;
  idInsumo: string;
  idUsuario?: string;
  tipoMovimiento: 'ENTRADA' | 'SALIDA';
  motivo: string;
  cantidad: number;
  precioUnitario?: number;
  subtotal?: number;
  stockAnterior?: number;
  stockNuevo?: number;
  referencia?: string;
  fechaMovimiento?: string;
}

export interface DetalleActividad {
  idDetalle?: number;
  idActividad?: number;
  idInsumo: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface ActividadCultivo {
  idActividad?: number;
  idCultivo: number;
  tipoActividad: string;
  descripcion?: string;
  fechaActividad?: string;
  costoTotal: number;
  estado?: boolean;
  completado?: boolean;
  detalles?: DetalleActividad[];
}

export interface AsignacionDetalle {
  idAsignacionDetalle?: number;
  idAsignacionCabecera?: number;
  idUsuario: string;
  costoManoObra: number;
}

export interface AsignacionCabecera {
  idAsignacionCabecera?: number;
  idActividad: number;
  fechaAsignacion?: string;
  horasTrabajadas: number;
  costoTotalManoObra?: number;
  observacion?: string;
  estado?: boolean;
  detalles?: AsignacionDetalle[];
}

export interface HarvestPlantingCycle {
  idHarvestDetail?: number;
  idHarvest?: number;
  idCultivo: number;
  kilosOptimos: number;
  kilosMerma: number;
}

export interface Harvest {
  idHarvest?: number;
  responsable: string;
  fechaCosecha: string;
  estado?: boolean;
  detalles?: HarvestPlantingCycle[];
}
