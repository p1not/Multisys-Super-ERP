import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-gridcard-viewer',
  templateUrl: './gridcard-viewer.component.html',
  styleUrls: ['./gridcard-viewer.component.scss'],
})
export class GridcardViewerComponent implements OnInit, AfterViewInit {
  public isMenuOpen = false;
  searchText: string = '';
  originalData: any[] = [];
  filteredData: any[] = [];
  tableStates: { [group: string]: boolean } = {};
  selectedFilter: string = 'open';
  isLoading: boolean = true;
  gridFunction: string = '';
  selectRowfunction: string = '';
  keys: string[] = []; // Chaves dinâmicas extraídas do JSON
  hiddenColumns: string[] = ['id', 'icon'];
  header: any;
  headerHeight: any;
  currentPage: number = 1;
  itemsPerPage: number = 15;
  //pagedData: any[] = [];
  cardTitle: string = '';
  formDatafunction: any[] = [];
  rowData: any[] = [];
  _url: string = '';

  private activatedRoute = inject(ActivatedRoute);

  // Variáveis de ordenação
  sortColumn: string = '';  // Coluna que está sendo ordenada
  sortDirection: 'ASC' | 'DESC' = 'ASC';  // Direção da ordenação

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }
  ngAfterViewInit(): void {
    // const header = document.querySelector('ion-header');
    // const cardHeader = document.querySelector('ion-card-header');
    const windowHeight = window.innerHeight; // Altura disponível

    // Aplique o valor a uma variável CSS
    document.documentElement.style.setProperty('--windowHeight', `${windowHeight}px`);

    // Detectar navegação para recarregar dados
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        // Quando o evento de navegação ocorre, recarregar dados
        this.http.post<any[]>(`/api/core/generic/call/${this.gridFunction}`, null, 
          { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
        ).subscribe(
          (response) => {
            this.originalData = response;
            this.filteredData = [...this.originalData];  // Inicia o filtro com todos os dados
            if (this.originalData.length > 0) {
              this.keys = Object.keys(this.originalData[0]); // Pegando as chaves do primeiro elemento
            }
          },
          (error) => {
            console.error('Erro ao fazer o request:', error);
          }
        );
      });

    this.getUniqueGroups().forEach(group => {
      this.tableStates[group] = true;
    });

    this.isLoading = false;  
  }

  ngOnInit() {
    // Verifica se o estado contém o título

    // const state = history.state;
    // pega parametros do GET da rota
    // this.cardTitle = this.activatedRoute.snapshot.paramMap.get('title') as string; 
    
    // pega parametro do corpo da rota
    // if (state) {
    //   this.cardTitle = state['title'] || '';
    //   this.gridFunction = state['gridfunction'] || '';
    // }

    if (this.router.getCurrentNavigation()?.extras.state) {
      this.cardTitle = this.router.getCurrentNavigation()?.extras.state?.['title'] || '';
      this.gridFunction = this.router.getCurrentNavigation()?.extras.state?.['gridfunction'] || '';
      this.selectRowfunction = this.router.getCurrentNavigation()?.extras.state?.['selectrowfunction'] || '';
      this.hiddenColumns = this.router.getCurrentNavigation()?.extras.state?.['hiddenColumns'] || ['id', 'icon'];
      this._url = this.router.getCurrentNavigation()?.extras.state?.['url'] || '';
    }
  } 

  search() {
    if (this.searchText.trim() === '') {
      // Se o campo de pesquisa estiver vazio, restaura os dados originais e a paginação
      this.filteredData = [...this.originalData];
    } else {
      const searchTextLower = this.searchText.toLowerCase();
            
      // Filtrar os dados com base no texto digitado
      this.filteredData  = this.originalData.filter(item => {
        return Object.keys(item).some(key => {
          const value = item[key] ? item[key].toString().toLowerCase() : '';
          return value.includes(searchTextLower);
        });
      });
    }
  }


  selectRow(row: any) {
    // Obtem dados do form da linha selecionada
    this.http.post<any[]>(`/api/core/generic/call/${this.selectRowfunction}`, { url: this._url },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).subscribe(
      (response) => {
         this.rowData = response;
        if (this.rowData.length > 0) {
          // Navega para a tela de formulário
          this.router.navigate(['/form-viewer'],{ 
            state: { 
              url: this.rowData[0].url,                     
              formtitle: this.rowData[0].formtitle,                   
              gridfunction: this.rowData[0].gridfunction,             
              createfunction: this.rowData[0].createfunction,         
              updatefunction: this.rowData[0].updatefunction,         
              formfieldsfunction: this.rowData[0].formfieldsfunction, 
              id: row.id 
            } 
          });
        }
        else {
          console.error('Erro: Nenhum dado retornado para navegar.');
        }
      },
      (error) => {
        console.error('Erro ao fazer o request:', error);
      }
    ); 
  }

  addNew() {
    //this.router.navigate(['-1'], { relativeTo: this.activatedRoute });    //NÃO PODE SER ASSIM, EXCLUÍ A PAGE CONFIGURATIONS (AREA DE TRABALHO)
    //this.router.navigate(['/form-viewer'], { state: { id: '-1' , url: this._url} });        //TERMINAR DE CONSERTAR
    
    this.http.post<any[]>(`/api/core/generic/call/${this.selectRowfunction}`, { url: this._url },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).subscribe(
      (response) => {
         this.rowData = response;
        if (this.rowData.length > 0) {
          // Navega para a tela de formulário
          this.router.navigate(['/form-viewer'],{ 
            state: { 
              url: this.rowData[0].url,
              formtitle: this.rowData[0].formtitle,
              gridfunction: this.rowData[0].gridfunction,
              createfunction: this.rowData[0].createfunction,
              updatefunction: this.rowData[0].updatefunction,
              formfieldsfunction: this.rowData[0].formfieldsfunction,
              id: '-1' 
            } 
          });
        }
        else {
          console.error('Erro: Nenhum dado retornado para navegar.');
        }
      },
      (error) => {
        console.error('Erro ao fazer o request:', error);
      }
    ); 

  }

  get startRecord(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endRecord(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredData.length);
  }

  get pagedData(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = this.currentPage * this.itemsPerPage;
    return this.filteredData.slice(start, end);
  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.filteredData.length) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  authenticateAndFetchData() {
    this.http.post<any[]>(`/api/core/generic/call/${this.gridFunction}`, null, 
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).subscribe(
      (response) => {
        this.originalData = response;
        this.filteredData = [...this.originalData];  // Inicia o filtro com todos os dados
        if (this.originalData.length > 0) {
          this.keys = Object.keys(this.originalData[0]); // Pegando as chaves do primeiro elemento
        }
      },
      (error) => {
        console.error('Erro ao fazer o request:', error);
      }
    );    
  }

  hideColumns() {
    this.hiddenColumns.forEach(column => {
      const columnElement = document.querySelectorAll(`ion-grid ion-col[data-column="${column}"]`);
      columnElement.forEach((element) => {
        (element as HTMLElement).style.display = 'none';
      });
    });
  }

  isColumnHidden(column: string): boolean {
    return this.hiddenColumns.includes(column);
  }

  getUniqueGroups(): string[] {
    const uniqueGroups = new Set<string>();
    this.filteredData.forEach(item => uniqueGroups.add(item.groupText));
    return Array.from(uniqueGroups);
  }

  getGroupedRecords(groupText: string): any[] {
    return this.filteredData.filter(item => item.groupText == groupText);
  }

  getKeys(): string[] {
    return this.keys;
  }

  isTableOpen(groupText: string): boolean {
    return this.tableStates[groupText] = !this.tableStates[groupText];
    //return this.tableStates[groupText];
  }


  // Função para ordenar a tabela 
  sortData(column: string) {
    if (this.sortColumn === column) {
      // Alterna a direção se a coluna já estiver sendo ordenada
      this.sortDirection = this.sortDirection === 'ASC' ? 'DESC' : 'ASC';
    } else {
      // Caso contrário, define a coluna de ordenação e começa com ASC
      this.sortColumn = column;
      this.sortDirection = 'ASC';
    }

    // Ordenar os dados
    this.filteredData = this.filteredData.slice().sort((a, b) => {
      const aValue = a[column] || '';  // Obtém o valor da coluna
      const bValue = b[column] || '';

      if (this.sortDirection === 'ASC') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }
}