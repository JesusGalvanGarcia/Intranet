import { ColDef } from "ag-grid-community";

export class GridActions{
    public static readonly ADD='Agregar';
    public static readonly EDIT='Editar';
    public static readonly DELETE='Eliminar';
    public static readonly Continue='Continuar';
    public static readonly Start='Empezar';
    public static readonly Seen='Ver';
    public static readonly Acept='Enviar';
    public static readonly Report='Ver reportes';
    public static readonly AddClient='Agregar Cliente';
    public static readonly AceptarReport='Aceptar Reporte';
    public static readonly VerReport='Ver Reporte';
    public static readonly SendEmails='Enviar correos';

    public static readonly DEFAULT_COLUMN: ColDef = 
    {
        headerName: '',
        field: '',
        cellClass: 'center-ag',
        cellRenderer: 'gridActionButton',
        width: 44,
        resizable: false,
        sortable: false,
        filter: false,
        suppressMovable: true,
        lockPosition: true,
        pinned: 'right'
    }
}