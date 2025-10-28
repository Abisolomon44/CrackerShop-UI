import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-data-grid',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input-data-grid.component.html',
  styleUrls: ['./input-data-grid.component.css']
})
export class InputDataGridComponent implements AfterViewInit {
  @Input() columns: any[] = []; // [{ field, header, type, options? }]
  @Input() data: any[] = [];
  @Input() editable = true;

  @Output() cellFocus = new EventEmitter<any>();
  @Output() cellBeginEdit = new EventEmitter<any>();
  @Output() cellEndEdit = new EventEmitter<any>();
  @Output() cellValueChanged = new EventEmitter<any>();
  @Output() keyDown = new EventEmitter<any>();
  @Output() keyPress = new EventEmitter<any>();
  @Output() focusChanged = new EventEmitter<any>();
  @Output() rowAdded = new EventEmitter<any>();
  @Output() columnResized = new EventEmitter<any>();

  @ViewChildren('gridInput') inputs!: QueryList<ElementRef>;

  focusedCell = { row: -1, col: -1 };
  resizingColumn: number | null = null;
  startX: number | null = null;
  startWidth: number | null = null;

  dropdownOpen = { row: -1, col: -1 };

  ngAfterViewInit() {
    setTimeout(() => this.focusCell(0, 0), 300);
  }

  /* ---------------- FOCUS & NAVIGATION ---------------- */
  focusCell(row: number, col: number) {
    this.focusedCell = { row, col };
    const input = this.getInput(row, col);
    if (input) input.nativeElement.focus();
    this.cellFocus.emit({ row, col, field: this.columns[col].field });
  }

  getInput(row: number, col: number): ElementRef | null {
    const flat = this.inputs.toArray();
    const index = row * this.columns.length + col;
    return flat[index] || null;
  }
handleKeyDown(event: KeyboardEvent, row: number, col: number) {
  this.keyDown.emit({ event, row, col });
  const key = event.key;

  if (key === 'Enter') {
    event.preventDefault();

    const isLastCol = col === this.columns.length - 1;
    const isLastRow = row === this.data.length - 1;

    if (!isLastCol) {
      // Move horizontally
      this.focusCell(row, col + 1);
    } else if (!isLastRow) {
      // Move to first column of next row
      this.focusCell(row + 1, 0);
    } else {
      // Last cell: add row and focus first cell
      this.addRow();
    }
  } else if (key === 'ArrowRight') {
    event.preventDefault();
    if (col < this.columns.length - 1) this.focusCell(row, col + 1);
  } else if (key === 'ArrowLeft') {
    event.preventDefault();
    if (col > 0) this.focusCell(row, col - 1);
  } else if (key === 'ArrowUp' && row > 0) {
    event.preventDefault();
    this.focusCell(row - 1, col);
  } else if (key === 'ArrowDown' && row < this.data.length - 1) {
    event.preventDefault();
    this.focusCell(row + 1, col);
  }
}


handleKeyPress(event: KeyboardEvent, row: number, col: number) {
  this.keyPress.emit({ event, row, col });
  
  const type = this.columns[col].type;
  const char = event.key;

  if (type === 'numbers') {
    // Allow digits, Backspace, Delete
    if (!/[0-9]/.test(char) && char !== 'Backspace' && char !== 'Delete') {
      event.preventDefault();
    }
  } else if (type === 'letters') {
    // Allow letters only
    if (!/[a-zA-Z]/.test(char) && char !== 'Backspace' && char !== 'Delete' && char !== ' ') {
      event.preventDefault();
    }
  }
}

  /* ---------------- EDITING ---------------- */
  beginEdit(row: number, col: number) {
    this.cellBeginEdit.emit({ row, col });
    this.openDropdown(row, col);
  }

  endEdit(row: number, col: number, value: any) {
    this.cellEndEdit.emit({ row, col, value });
    this.cellValueChanged.emit({ row, col, value });
    this.closeDropdown(row, col);
  }

  /* ---------------- ROW MANAGEMENT ---------------- */
  addRow() {
    const newRow: any = {};
    this.columns.forEach(c => newRow[c.field] = '');
    this.data.push(newRow);
    this.rowAdded.emit(newRow);
    setTimeout(() => this.focusCell(this.data.length - 1, 0), 200);
  }

  /* ---------------- COLUMN RESIZE ---------------- */
  startResize(event: MouseEvent, colIndex: number) {
    this.resizingColumn = colIndex;
    this.startX = event.pageX;
    this.startWidth = (event.target as HTMLElement).parentElement!.offsetWidth;
    document.addEventListener('mousemove', this.resizeMove);
    document.addEventListener('mouseup', this.resizeStop);
  }

  resizeMove = (event: MouseEvent) => {
    if (this.resizingColumn === null) return;
    const dx = event.pageX - (this.startX ?? 0);
    const newWidth = Math.max(50, (this.startWidth ?? 0) + dx);
    const th = document.querySelectorAll('th')[this.resizingColumn];
    if (th) (th as HTMLElement).style.width = `${newWidth}px`;
  }

  resizeStop = () => {
    this.columnResized.emit(this.resizingColumn);
    this.resizingColumn = null;
    document.removeEventListener('mousemove', this.resizeMove);
    document.removeEventListener('mouseup', this.resizeStop);
  }

  /* ---------------- COMBO BOX / DROPDOWN ---------------- */
  openDropdown(row: number, col: number) {
    if (this.columns[col].options?.length) this.dropdownOpen = { row, col };
  }

  closeDropdown(row: number, col: number) {
    setTimeout(() => this.dropdownOpen = { row: -1, col: -1 }, 150);
  }

  getFilteredOptions(value: string, col: any) {
    return col.options?.filter((opt: string) => opt.toLowerCase().includes((value || '').toLowerCase())) || [];
  }

  selectOption(row: number, col: number, value: string) {
    this.data[row][this.columns[col].field] = value;
    this.closeDropdown(row, col);
    this.focusNextCell(row, col);
  }

  focusNextCell(row: number, col: number) {
    const nextCol = col + 1;
    if (nextCol < this.columns.length) this.focusCell(row, nextCol);
  }
}
