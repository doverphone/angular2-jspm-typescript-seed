import { Component } from '@angular/core';
import {
  async,
  TestBed
 } from '@angular/core/testing';
import { FeatureModule } from './feature.module';

describe('Samples FeatureA component', () => {
  // Setting module for testing
  // Disable old forms

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [FeatureModule]
    });
  });

  it('should work',
    async(() => {
      TestBed
        .compileComponents()
        .then(() => {
          let fixture = TestBed.createComponent(TestComponent);
          let aboutDOMEl = fixture.debugElement.children[0].nativeElement;

          expect(aboutDOMEl.querySelectorAll('h2')[0].textContent).toEqual('Conditional Substitution');
        });
    }));
});

@Component({
  selector: 'test-cmp',
  template: '<sd-feature></sd-feature>'
})
class TestComponent {
}
