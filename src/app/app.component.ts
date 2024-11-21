import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public menus: any[] = [];
  public submenus: any[] = [];
  public labels = ['Notes', 'Reminders'];
  public isMenuOpen = false;
  public expandedMenus: Set<string> = new Set();
  public loadedSubmenus: { [key: string]: any[] } = {};  // Para armazenar submenus carregados
  expandedMenuLevels: { [key: number]: boolean } = {}; // Armazena o estado de expansão de cada nível de menu
  menuFunction: string = 'GetCoreSubmenusByMenus';

  constructor(
    private http: HttpClient,
    private location: Location,
    private router: Router
  ) { }

  goBack() {
    this.location.back();
  }  

  goForward() {
    this.location.forward();
  }

  async ngOnInit() {
    await this.getMenus('base');
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Função para carregar menus do nível atual
  async getMenus(level: string) {

    const reqbody = {
      "level": level
    };

    this.http.post<any[]>(`/api/core/generic/call/${this.menuFunction}`, reqbody,
    { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).subscribe(response => {
      if (level === 'base') {
        // Carregar menus "base" (principais)
        this.menus = response.map(menu => ({
          title: menu.description,
          url: menu.url,        
          level: menu.level,
          icon: menu.icon ?? `fa-solid fa-house`, 
          tem_submenus: parseInt(menu.tem_submenus ?? 0),
          isExpanded: false,
          gridfunction: menu.gridfunction,
          selectrowfunction: menu.selectrowfunction
        }));
      } else {
        // Carregar submenus e armazenar
        this.loadedSubmenus[level] = response.map(submenu => ({
          title: submenu.description,
          url: submenu.url,     
          level: submenu.level,
          icon: submenu.icon ?? `fa-solid fa-house`, 
          tem_submenus: parseInt(submenu.tem_submenus ?? 0),
          isExpanded: false,
          gridfunction: submenu.gridfunction,
          selectrowfunction: submenu.selectrowfunction
        }));
      }
    }, error => {
      console.error('Erro ao salvar o menu:', error);
    });
  }

  // Expande o menu ou submenu ao clicar
  async toggleExpand(menu: any) {
    const level = menu.level;

    if (this.expandedMenus.has(level)) {
      // Se já estiver expandido, recolhe o menu/submenu
      this.expandedMenus.delete(level);
      delete this.loadedSubmenus[level];  // Remove submenus carregados
    } else {
      // Expande o menu/submenu
      this.expandedMenus.add(level);

      if (menu.tem_submenus) {
        // Se o menu tem submenus, carrega-os via API
        if (!this.loadedSubmenus[level]) {
          await this.getMenus(level);  // Carregar submenus
        }
      }
    }
  }

  // Verifica se o menu ou submenu está expandido
  isExpanded(level: string): boolean {
    return this.expandedMenus.has(level);
  }

  // Verifica se o menu tem submenus para exibir o ícone de expansão
  hasSubmenus(menu: any): boolean {
    return menu.tem_submenus === 1;
  }

  // Navega para a URL do menu ou submenu, se não tiver submenus
  navigate(menu: any) {
    if (!menu.tem_submenus) {
      //window.location.href = menu.url;  //recarrega toda a aplicação
      this.router.navigate([menu.url], { state: { title: menu.title, url: menu.url, gridfunction: menu.gridfunction, selectrowfunction: menu.selectrowfunction, hiddenColumns: ['id', 'icon'] } });
      const menuElement = document.querySelector('ion-menu');
      if (menuElement) {
        menuElement.close();  // Fecha o menu lateral após a navegação
      }
    }
  }

  highlightItem(event: any, menu: any) {
    if (this.hasSubmenus(menu)) {
      event.target.style.backgroundColor = 'rgba(255, 235, 59, 0.3)'; // Amarelo com 30% de transparência
    }
  }

  removeHighlight(event: any, menu: any) {
    if (this.hasSubmenus(menu)) {
      event.target.style.backgroundColor = ''; // Remove a cor de fundo
    }
  }
}