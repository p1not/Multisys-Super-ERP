import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { GridcardViewerComponent } from './gridcard-viewer.component';

describe('GridcardViewer', () => {
  let component: GridcardViewerComponent;
  let fixture: ComponentFixture<GridcardViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GridcardViewerComponent],
      imports: [IonicModule.forRoot(), RouterModule.forRoot([])]
    }).compileComponents();

    fixture = TestBed.createComponent(GridcardViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
