import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';

@Component({
  selector: 'app-form-viewer',
  templateUrl: './form-viewer.component.html',
  styleUrls: ['./form-viewer.component.scss']
})
export class FormViewerComponent implements OnInit {
  formFields: any[] = [];
  url: string = '';
  formTitle: string = '';
  apiUrl: string = '';
  gridFunction: string = '';
  createFunction: string = '';
  updateFunction: string = '';
  formFieldsFunction: string = '';

  id: string | null = null;
  
  formData: any = {}; // Inicializa um objeto vazio para armazenar os dados do formulário

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private http: HttpClient,
    private location: Location
  ) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state;

    if (state) {
      this.url = state['url'];
      this.formTitle = state['formtitle'];
      this.gridFunction = state['gridfunction'];
      this.createFunction = state['createfunction'];
      this.updateFunction = state['updatefunction'];
      this.formFieldsFunction = state['formfieldsfunction'];
      this.id = state['id'];

      this.loadFormData();
    }
  }

  loadFormData() {
    // Faz a chamada para GetFormFields passando a URL do formulário
    this.http.post<any[]>(`/api/core/generic/call/${this.formFieldsFunction}`, { url: this.url }, {     // this.router.url usar o nome do formulário
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).subscribe(
      (response) => {
        if (response && response.length > 0) {
          // Utiliza o retorno de GetFormFields para preencher formFields
          this.formFields = response.map(field => ({
            name: field.name,
            label: field.label || this.formatLabel(field.name),
            customLabel: field.customLabel || null,
            type: field.type,
            required: field.required,
            value: '', // Inicializa o valor vazio, será preenchido pelos dados carregados depois
            position: { x: field.x, y: field.y },
            hide: field.hide,
            order: field.order
          }));
  
          // Ordena os campos pela propriedade 'order'
          this.formFields.sort((a, b) => a.order - b.order);
  
          // Carrega os dados do formulário se tiver um id
          if (this.id && this.id !== '-1') {
            this.loadFormDataValues();
          }
        }
      },
      (error) => {
        console.error('Erro ao carregar campos do formulário:', error);
      }
    );
  }
  
  // Método adicional para carregar os valores dos campos (dados do formulário)
  loadFormDataValues() {
    this.http.post<any[]>(`/api/core/generic/call/${this.gridFunction}`, { id: this.id }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).subscribe(
      (response) => {
        if (response && response.length > 0) {
          const data = response[0];
  
          // Preenche os valores dos campos dinâmicos
          this.formFields.forEach(field => {
            field.value = data[field.name] || '';
            this.formData[field.name] = field.value;
          });
        }
      },
      (error) => {
        console.error('Erro ao carregar dados do formulário:', error);
      }
    );
  }
  
  // Função para formatar labels
  formatLabel(key: string): string {
    // Formata a chave do objeto para um formato mais amigável
    return key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }  

  onSubmit(form: any) {
    //verifico se estou editando ou criando
    const url = this.id && this.id !== '-1' ? this.updateFunction : this.createFunction;

    // Se estou editando o registro, coloco o id no formData
    if(this.id && this.id !== '-1'){
      // Adiciona o id ao formData, caso não exista ou esteja vazio
      if (!this.formData.id || this.formData.id === '') {
        this.formData.id = Number(this.id);
      }
    }    

    if (form.valid) {
      this.http.post(`/api/core/generic/call/${url}`, this.formData, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      }).subscribe(
        (response: any) => {
          // Verifica o status_code retornado na resposta
          if (response && response.length > 0 && response[0].status == 'success') {
            //console.log('Formulário enviado com sucesso:', response);
            alert(response[0].message);
            this.location.back(); // Retorna para a página anterior
            //this.router.navigate(['../'], { relativeTo: this.route });    //ajustar para voltar para a página anterior, a de lista de menus http://localhost:8100/configurations/administrators/menus
          } else {
            console.error('Erro ao enviar o formulário:', response);
          }
        },
        (error) => {
          console.error('Erro ao enviar o formulário:', error);
        }        
      );
    }
  }
}
