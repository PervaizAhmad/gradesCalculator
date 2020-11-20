import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, Validators, FormControl, AbstractFormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private fb: FormBuilder) {}
  form: FormGroup;

  formErrors = {
    modules: this.modulesErrors()
  };

  validationMessages = {
    modules: {
      module: {
        required: 'module is required.',
        pattern: 'module must be 3 characters long.'

      },
      assessments: {
        A1: {
          required: 'A1 is required.',
          pattern: 'A1 must be 3 characters long.'
        },
        A2: {
          required: 'A2 is required.',
          pattern: 'A2 must be 3 characters long.'
        },
        Zs: {
          Z: {
            required: 'Z is required.',
            pattern: 'Z must be 3 characters long.'
          }
        }
      }
    }
  };

  ngOnInit(): void {
    this.form = this.fb.group({
      courseName: [],
      targetGrade: [],
      year: [],
      modules: this.fb.array([
        this.initModule()
      ])
    });
    this.form.valueChanges.subscribe(data => this.validateForm());
    this.validateForm();
  }

  initModule(): FormGroup {
    return this.fb.group({
      //  ---------------------forms fields on module level ------------------------
      module: ['Programming', [Validators.required, Validators.pattern('[0-9]{3}')]],
      // ---------------------------------------------------------------------
      assessments: this.fb.array([
        this.initAssess()
      ])
    });
  }

  initAssess(): FormGroup {
    return this.fb.group({
      //  ---------------------forms fields on y level ------------------------
      A1: ['A1', [Validators.required, Validators.pattern('[0-9]{3}')]],
      A2: ['A2', [Validators.required, Validators.pattern('[0-9]{3}')]],
      // ---------------------------------------------------------------------
      Zs: this.fb.array([
        this.initZ()
      ])
    });
  }

  initZ(): FormGroup {
    return this.fb.group({
      //  ---------------------forms fields on z level ------------------------
      Z: ['90', [Validators.required, Validators.pattern('[0-9]{3}')]],
      // ---------------------------------------------------------------------
    });
  }

  addModule(): void {
    const control = this.form.controls.modules as FormArray;
    control.push(this.initModule());
  }


  addAssess(ix): void {
    const control = (this.form.controls.modules as FormArray).at(ix).get('assessments') as FormArray;
    control.push(this.initAssess());
  }

  addGrade(ix, iy): void {
    const control = ((this.form.controls.modules as FormArray).at(ix).get('assessments') as FormArray).at(iy).get('Zs') as FormArray;
    control.push(this.initZ());
  }

  modulesErrors() {
    return [{
      //  ---------------------forms errors on module level ------------------------
      module: '',
      // ---------------------------------------------------------------------
      assessments: this.assessmentsErrors()
    }];
  }

  assessmentsErrors() {
    return [{
      //  ---------------------forms errors on assess level ------------------------
      A1: '',
      A2: '',
      // ----------------------------------------------------------------------
      Zs: this.ZsErrors()
    }];
  }

  ZsErrors() {
    return [{
      //  ---------------------forms errors on z level ------------------------
      Z: ''
      // ---------------------------------------------------------------------
    }];
  }

  // form validation
  validateForm(): void {
    // console.log('validateForm');
    // for (let field in this.formErrors) {
    //   this.formErrors[field] = '';
    //   let input = this.register_readers.get(field);
    //   if (input.invalid && input.dirty) {
    //     for (let error in input.errors) {
    //       this.formErrors[field] = this.validationMessages[field][error];
    //     }
    //   }
    // }
    this.validateModules();
  }
  validateModules(): void {
    const modulesA =  this.form.controls.modules as FormArray;
    console.log('validateModules');
    // console.log(modulesA.value);
    this.formErrors.modules = [];
    let m = 1;
    while (m <= modulesA.length) {
      this.formErrors.modules.push({
        module: '',
        assessments: [{
          A1: '',
          A2: '',
          Zs: [{
            Z: ''
          }]
        }]
      });
      const module =  modulesA.at(m - 1) as FormGroup;
      console.log('module--->');
      console.log(module.value);
      for (const field in module.controls) {
        const input = module.get(field);
        console.log('field--->');
        console.log(field);
        if (input.invalid && input.dirty) {
          for (const error in input.errors) {
            this.formErrors.modules[m - 1][field] = this.validationMessages.modules[field][error];
          }
        }
      }
      this.validateAssessments(m);
      m++;
    }
  }

  validateAssessments(m): void {
    console.log('validateAssessments');
    const assessmentsA = (this.form.controls.modules as FormArray).at(m - 1).get('assessments') as FormArray;
    this.formErrors.modules[m - 1].assessments = [];
    let a = 1;
    while (a <= assessmentsA.length) {
      this.formErrors.modules[m - 1].assessments.push({
        A1: '',
        A2: '',
        Zs: [{
          Z: ''
        }]
      });
      const assess =  assessmentsA.at(a - 1) as FormGroup;
      for (const field in assess.controls) {
        const input = assess.get(field);
        if (input.invalid && input.dirty) {
          for (const error in input.errors) {
            this.formErrors.modules[m - 1].assessments[a - 1][field] = this.validationMessages.modules.assessments[field][error];
          }
        }
      }
      this.validateZs(m, a);
      a++;
    }
  }

  validateZs(m, a): void {
    console.log('validateZs--');
    const ZsA = ((this.form.controls.modules as FormArray).at(m - 1).get('assessments') as FormArray).at(a - 1).get('Zs') as FormArray;
    this.formErrors.modules[m - 1].assessments[a - 1].Zs = [];
    let z = 1;
    while (z <= ZsA.length) {
      this.formErrors.modules[m - 1].assessments[a - 1].Zs.push({
        Z: ''
      });
      const Z =  ZsA.at(z - 1) as FormGroup;
      for (const field in Z.controls) {
        const input = Z.get(field);
        console.log('input--->');
        console.log(input);
        if (input.invalid && input.dirty) {
          for (const error in input.errors) {
            this.formErrors.modules[m - 1].assessments[a - 1].Zs[z - 1][field] = this.validationMessages.modules.assessments.Zs[field][error];
          }
        }
      }
      // this.validateSamnumbers(m, a);
      z++;
    }
  }
}
