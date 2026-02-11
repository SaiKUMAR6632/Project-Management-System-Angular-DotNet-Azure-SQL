import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface EmployeeDialogData {
  employees: any[];
  selectedIds: number[];
  projectId: string;
}

@Component({
  selector: 'app-employee-selection-dialog',
  templateUrl: './employee-selection-dialog.component.html'
})
export class EmployeeSelectionDialogComponent implements OnInit {
  selectedEmployees: number[] = [];
  searchText = '';

  constructor(
    public dialogRef: MatDialogRef<EmployeeSelectionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EmployeeDialogData
  ) {}

  ngOnInit() {
    this.selectedEmployees = [...this.data.selectedIds];
  }

  isSelected(empId: number): boolean {
    return this.selectedEmployees.includes(empId);
  }

  toggleEmployee(empId: number) {
    if (this.isSelected(empId)) {
      this.selectedEmployees = this.selectedEmployees.filter(id => id !== empId);
    } else {
      this.selectedEmployees.push(empId);
    }
  }

  filteredEmployees() {
    if (!this.searchText) return this.data.employees;
    const search = this.searchText.toLowerCase();
    return this.data.employees.filter(emp => 
      emp.fullName.toLowerCase().includes(search) ||
      emp.email.toLowerCase().includes(search)
    );
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    this.dialogRef.close(this.selectedEmployees);
  }
}