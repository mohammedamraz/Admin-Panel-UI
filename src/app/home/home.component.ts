import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { map } from 'rxjs';
import { AdminConsoleService } from '../services/admin-console.service';

interface PersonDetails {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  activeWizard1: number = 1;
  activeWizard2: number = 1;
  activeWizard3: number = 1;
  activeWizard4: number = 1;

  list: number = 3;
  listdetails:any[]=[];


  persons: PersonDetails[] = [];
  constructor(
    private readonly adminService: AdminConsoleService,
    private fb: FormBuilder,
    private modalService: NgbModal) { }
  organisationCount:any=0;
  vitalsCount:any=0;
  basicWizardForm!: FormGroup;
  progressWizardForm !: FormGroup;
  btnWizardForm !: FormGroup;
  
  
  accountForm!: FormGroup;

  profileForm!: FormGroup;

  validationWizardForm!: FormGroup;

  ngOnInit(): void {

    this.adminService.fetchOrganisationCount().pipe(map(doc =>{this.organisationCount=doc;return doc}))
    this.adminService.fetchVitalsCount().pipe(map(doc =>{this.vitalsCount=doc;return doc}))
    this.adminService.fetchlatestOrg().pipe(map(doc =>{console.log('aaaa',doc );return doc}))
    
  this.persons = [
    {
      id: 1,
      firstName: 'Mark',
      lastName: 'Otto',
      userName: '@mdo'
    },
    {
      id: 2,
      firstName: 'Jacob',
      lastName: 'Thornton',
      userName: '@fat'
    },
    {
      id: 3,
      firstName: 'Larry',
      lastName: 'the Bird',
      userName: '@twitter'
    }
  ];

      // initialize forms
      this.basicWizardForm = this.fb.group({
        account: this.fb.group({
          userName: [''],
          password: ['123456'],
          rePassword: ['123456']
        }),
        profile: this.fb.group({
          firstName: ['Francis'],
          lastName: ['Brinkman'],
          email: ['cory1979@hotmail.com', Validators.email]
        }),
        acceptTerms: [false, Validators.requiredTrue]
      });
  
      this.btnWizardForm = this.fb.group({
        account: this.fb.group({
          userName: ['hyper'],
          password: ['123456'],
          rePassword: ['123456']
        }),
        profile: this.fb.group({
          firstName: ['Francis'],
          lastName: ['Brinkman'],
          email: ['cory1979@hotmail.com', Validators.email]
        }),
        acceptTerms: [false, Validators.requiredTrue]
      });
  
      this.progressWizardForm = this.fb.group({
        account: this.fb.group({
          userName: ['hyper'],
          password: ['123456'],
          rePassword: ['123456']
        }),
        profile: this.fb.group({
          firstName: ['Francis'],
          lastName: ['Brinkman'],
          email: ['cory1979@hotmail.com', Validators.email]
        }),
        acceptTerms: [false, Validators.requiredTrue]
      });
  
      this.accountForm = this.fb.group({
        userName: ['', Validators.required],
        password: ['', Validators.required],
        rePassword: ['', Validators.required]
      })
  
      this.profileForm = this.fb.group({
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]]
      })
  
      this.validationWizardForm = this.fb.group({
        acceptTerms: [false, Validators.requiredTrue]
      })
  }

  open(content: TemplateRef<NgbModal>): void {
    this.modalService.open(content, { centered: true });
  }

  demoFunction(event:any, product:string){
    console.log('asdf',event.target.checked);
    if(event.target.checked){
      this.list++;
      let details={name:product, index:this.list--}
      this.listdetails.push(details)
    }
    else{
      this.list--;
      const selected =this.listdetails.findIndex(obj=>obj.name===product);
      this.listdetails.splice(selected,1)
    }
  }

}
