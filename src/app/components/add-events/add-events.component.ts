import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NumberValueAccessor } from '@angular/forms';
import { CalendarService } from 'src/app/calendar.service';
import { Event } from 'src/app/event';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Category } from 'src/app/category';
import { GroupService } from 'src/app/group.service';
import { forkJoin, Observable } from 'rxjs';
import { NgbDropdownItem } from '@ng-bootstrap/ng-bootstrap';
import { Activity } from 'src/app/activity';

interface DropdwownItem{
  item_id:number;
  item_text?:string;
}

@Component({
  selector: 'app-add-events',
  templateUrl: './add-events.component.html',
  styleUrls: ['./add-events.component.css']
})
export class AddEventsComponent implements OnInit {

  

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  formGroup: FormGroup;
  dropdownList: DropdwownItem[]= [];
  selectedItems: DropdwownItem[]= [];
  categoryList: Category[] = [];
  dropdownSettings: IDropdownSettings = {};
  isDataAvailable:boolean = false;

  constructor(private calendarService: CalendarService, public fb: FormBuilder, private groupService: GroupService) { 
    this.formGroup = this.fb.group({
      name: new FormControl(''),
      startDateTime: new FormControl(''),
      endDateTime: new FormControl(''),
      description: new FormControl(''),
      location: new FormControl(''),
      selectedItems: new FormControl([])
    })
  }

  ngOnInit(): void {
    this.dropdownList = [
      { item_id: 1, item_text: 'Music' },
      { item_id: 2, item_text: 'Theatre' },
      { item_id: 3, item_text: 'Sport' },
      { item_id: 4, item_text: 'Comedy' },
      { item_id: 5, item_text: 'Education' },
      { item_id: 6, item_text: 'Cinema' },
      { item_id: 7, item_text: 'Discussion' },
      { item_id: 8, item_text: 'Others' }
    ];
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  role = sessionStorage.getItem('role');

  event = new Event();

  submitted = false;

  title = 'Add new event'

  onSubmit() { this.submitted = true; }

  addEvent() {
    this.event = new Event(this.formGroup.value);
    this.event.userEmail = sessionStorage.getItem("email");
  
    this.calendarService.addEvent(this.event)
      .subscribe(data => {
        console.log(data);
  
        let selectedItems: DropdwownItem[] = this.formGroup.get('selectedItems')?.value;
        let eventName = this.event.name;
  
        let categoryRequests = selectedItems.map((s) => {
          let category: Category = { name: s.item_text, eventName };
          return this.groupService.addCategoryToEvent(category);
        });
  
        forkJoin(categoryRequests).subscribe(results => {
          console.log(results);
          window.location.reload(); 
        });
      });
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

}
