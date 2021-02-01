import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-project-selector-modal',
  templateUrl: './project-selector-modal.component.html',
  styleUrls: ['./project-selector-modal.component.css']
})
export class ProjectSelectorModalComponent implements OnInit {

  @Input() AllProjects;
  SelectAll = false;
  @Output() CloseModal = new EventEmitter<any>();
  @Output() SendSelectedProjects = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    console.log('ngOnInit() : ', this.AllProjects);
    this.CheckSelectAll()
  }

  Close() {
    this.CloseModal.emit(false);
  }

  SelectAllToggle(event) {
    if (event.currentTarget.checked) {
      this.AllProjects.forEach(e => {
        e.Is_Selected = true;
      });
    }
    else {
      this.AllProjects.forEach(e => {
        e.Is_Selected = false;
      });
    }
  }

  saveProjects() {
    const projectList = this.SendSelected();
    console.log('saveProjects() : ', projectList);
    this.SendSelectedProjects.emit(projectList);

  }

  CheckSelectAll() {
    if (this.AllProjects.every(v => v.Is_Selected == true)) {
      this.SelectAll = true;
    }
    else {
      this.SelectAll = false;
    }
  }

  checkSelect(Id) {
    this.AllProjects[Id].Is_Selected = !this.AllProjects[Id].Is_Selected;
    if (this.AllProjects.every(v => v.Is_Selected == true)) {
      this.SelectAll = true;
    }
    else {
      this.SelectAll = false;
    }
  }

  SendSelected() {
    let dataobj = [];
    this.AllProjects.forEach((e) => {
      if (e.Is_Selected) {
        e.Is_Old = true;
        dataobj.push(e);
      } else {
        e.Is_Old = false;
        e.Is_Selected = false
      }
    });
    return dataobj;
  }
}
