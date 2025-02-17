import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ColDef, ColGroupDef, ColumnApi, CsvExportParams, GridApi, GridReadyEvent } from 'ag-grid-community';
import { AG_GRID_LOCALE_ES } from 'src/locale.es';
import { GridActionButtonComponent } from './grid-action-button/grid-action-button.component';
import { GridActions } from '@utils/grid-action';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit, OnChanges {
  public agGrid: any = this;
  @Input() columnDefs: (ColDef | ColGroupDef)[] | undefined;
  @Input() autoGroupColumnDef: ColDef;
  @Input() defaultColDef: ColDef = {
      resizable: true,
      sortable: true,
      filter: true,
      floatingFilter: true,
    };
  @Input() suppressRowClickSelection: boolean = true;
  @Input() groupSelectsChildren: boolean = false;
  @Input() rowSelection: 'single' | 'multiple' = 'multiple';
  @Input() rowGroupPanelShow: 'always' | 'onlyWhenGrouping' | 'never';
  @Input() pivotPanelShow: 'always' | 'onlyWhenPivoting' | 'never';
  @Input() domlayout: 'normal' | 'autoHeight' | 'print' = 'autoHeight';
  @Input() animateRows: boolean = true;
  @Input() pagination: boolean = true;
  @Input() rowData: any | null;
  @Output() gridReady: any;
  @Input() paginationPageSize: number = 10;
  @Input() exportTitle: string = 'Export';
  @Input() enableEdit: boolean = false;
  @Input() enableDelete: boolean = false;
  protected gridApi: GridApi;
  protected gridColumnApi: ColumnApi;

  @Output() actionEvent = new EventEmitter<{action:string, data: any}>();

  public localeText: {
    [key: string]: string;
  } = AG_GRID_LOCALE_ES;

  frameworkComponents = {
    'gridActionButton' : GridActionButtonComponent
  };
  constructor() {  }  
  ngOnInit() {
    if(this.columnDefs == null)
    {
      return;
    }
    // Agrega el botón de editar si enableEdit es verdadero
    if (this.enableEdit) {
      this.columnDefs.push(this.createButtonDefinition(GridActions.EDIT, false));
    }
    // Agrega el botón de eliminar si enableDelete es verdadero
    if (this.enableDelete) {
      this.columnDefs.push(this.createButtonDefinition(GridActions.DELETE, false));
    }
  
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.gridApi)
    {
      this.gridApi.sizeColumnsToFit();
    }
  }

  protected onGridReady(params: GridReadyEvent) {
    params.api.setRowData(this.rowData);
    if(params.api.getColumnDefs())
    {
      this.columnDefs = params.api.getColumnDefs();
    }
    this.gridApi= params.api;
    this.gridColumnApi = params.columnApi;
    
    params.api.sizeColumnsToFit();
    
  }

  public actionButton(actionData: {action: string, data: any})
  {
    this.actionEvent.emit({
      action: actionData.action,
      data: actionData.data
    })
  }

  private createButtonDefinition(action: string, disabled: boolean): ColDef {
    return {
      headerName: '',
      field: '',
      cellClass: 'center-ag',
      cellRenderer: 'gridActionButton',
      cellRendererParams: {
        action: action,
        disabled: disabled
      },
      width: 44,
      resizable: false,
      sortable: false,
      filter: false,
      suppressMovable: true,
      lockPosition: true,
      pinned: 'right',
    };
  }

  //#region Exportar CSV
  protected onCsvExport() {
    const params = this.getParams();
    this.gridApi.exportDataAsCsv(params);
  }

  private getParams(): CsvExportParams {
    const currentDate = new Date();
    const datePart = currentDate.toLocaleDateString().replace(/\//g, "-"); // Formatea la fecha

    // Obtiene la hora en formato de 24 horas
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    const timePart = `${hours.toString().padStart(2, '0')}${minutes.toString().padStart(2, '0')}${seconds.toString().padStart(2, '0')}`;

    const fileName = `${this.exportTitle}_${datePart}_${timePart}`;

    return {
      fileName: fileName,
    };
  }
  //#endregion
}
