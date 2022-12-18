import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Category } from 'src/app/category';
import { Group } from 'src/app/group';
import { GroupService } from 'src/app/group.service';

interface DropdwownItem{
  item_id:number;
  item_text?:string;
}

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  formGroup: FormGroup;
  formGroupJoin: FormGroup;
  dropdownList: DropdwownItem[]= [];
  selectedItems: DropdwownItem[]= [];
  categoryList: Category[] = [];
  dropdownSettings: IDropdownSettings = {};
  group = new Group();

  constructor(private groupService: GroupService, public fb: FormBuilder) { 
    this.formGroup = this.fb.group({
      name: new FormControl(''),
      description: new FormControl(''),
      selectedItems: new FormControl([])
    })
    this.formGroupJoin = this.fb.group({
      code: new FormControl('')
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

  addGroup(){
    this.group = new Group(this.formGroup.value);
    this.group.userEmail = sessionStorage.getItem("email");
    this.groupService.addGroup(this.group)
      .subscribe(data => {
        console.log(data);
      })
  }

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

}
