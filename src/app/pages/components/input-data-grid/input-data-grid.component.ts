import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChildren,
  QueryList,
  AfterViewInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-data-grid',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input-data-grid.component.html',
  styleUrls: ['./input-data-grid.component.css'],
})
export class InputDataGridComponent implements AfterViewInit {

  /* =============================
   🧠 DataGridView-Like Properties
  ==============================*/
  @Input() columns: any[] = [];
  @Input() data: any[] = [];

  @Input() allowUserToAddRows = true;
  @Input() allowUserToDeleteRows = false;
  @Input() allowUserToResizeColumns = true;

  @Input() readOnly = false;
  @Input() selectionMode: 'CellSelect' | 'FullRowSelect' = 'CellSelect';

  /* =============================
   📤 Events
  ==============================*/
  @Output() cellFocus = new EventEmitter<any>();
  @Output() cellBeginEdit = new EventEmitter<any>();
  @Output() cellEndEdit = new EventEmitter<any>();
  @Output() cellValueChanged = new EventEmitter<any>();
  @Output() rowAdded = new EventEmitter<any>();
  @Output() rowDeleted = new EventEmitter<any>();
  @Output() columnResized = new EventEmitter<any>();

  /* =============================
   🔧 Internal state
  ==============================*/
  @ViewChildren('gridInput') inputs!: QueryList<ElementRef>;
  focusedCell = { row: -1, col: -1 };
  editingCell = { row: -1, col: -1 };

  resizingColumn: number | null = null;
  startX: number | null = null;
  startWidth: number | null = null;

  ngAfterViewInit() {
    if (this.data.length) setTimeout(() => this.focusCell(0, 0), 200);
  }

  /* ---------------- Focus & Navigation ---------------- */
  focusCell(row: number, col: number) {
    this.focusedCell = { row, col };
    this.cellFocus.emit({ row, col, field: this.columns[col].field });
  }

  enableEditing(row: number, col: number) {
    if (this.readOnly) return;
    this.editingCell = { row, col };
    this.cellBeginEdit.emit({ row, col });
    setTimeout(() => this.getInput(row, col)?.nativeElement.focus(), 10);
  }

  disableEditing(row: number, col: number) {
    if (this.isEditingCell(row, col)) {
      const field = this.columns[col].field;
      const value = this.data[row][field];
      this.cellEndEdit.emit({ row, col, value });
      this.cellValueChanged.emit({ row, col, value });
      this.editingCell = { row: -1, col: -1 };
    }
  }

  isEditingCell(row: number, col: number): boolean {
    return this.editingCell.row === row && this.editingCell.col === col;
  }

  getInput(row: number, col: number): ElementRef | null {
    const flat = this.inputs.toArray();
    const index = row * this.columns.length + col;
    return flat[index] || null;
  }

  /* ---------------- Keyboard Handling ---------------- */
  handleKeyDown(event: KeyboardEvent, row: number, col: number) {
    const key = event.key.toLowerCase();

    if (key === 'enter') {
      event.preventDefault();
      if (this.isEditingCell(row, col)) {
        this.disableEditing(row, col);
        const nextCol = col < this.columns.length - 1 ? col + 1 : 0;
        const nextRow = nextCol === 0 && row < this.data.length - 1 ? row + 1 : row;
        setTimeout(() => this.focusCell(nextRow, nextCol), 10);
      } else {
        this.enableEditing(row, col);
      }
      return;
    }

    // Arrow keys navigation
    switch (key) {
      case 'arrowright':
        if (col < this.columns.length - 1) {
          event.preventDefault();
          this.focusCell(row, col + 1);
        }
        break;
      case 'arrowleft':
        if (col > 0) {
          event.preventDefault();
          this.focusCell(row, col - 1);
        }
        break;
      case 'arrowup':
        if (row > 0) {
          event.preventDefault();
          this.focusCell(row - 1, col);
        }
        break;
      case 'arrowdown':
        if (row < this.data.length - 1) {
          event.preventDefault();
          this.focusCell(row + 1, col);
        }
        break;
    }
  }

  /* ---------------- Row Management ---------------- */
  addRow() {
    const newRow: any = {};
    this.columns.forEach(c => (newRow[c.field] = ''));
    this.data.push(newRow);
    this.rowAdded.emit(newRow);
  }

  /* ---------------- Column Resize ---------------- */
  startResize(event: MouseEvent, colIndex: number) {
    if (!this.allowUserToResizeColumns) return;
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
  };

  resizeStop = () => {
    this.columnResized.emit(this.resizingColumn);
    this.resizingColumn = null;
    document.removeEventListener('mousemove', this.resizeMove);
    document.removeEventListener('mouseup', this.resizeStop);
  };
 handleKeyPress(event: KeyboardEvent, row: number, col: number) {
  // Only allow typing in focused cell
  if (!(this.focusedCell.row === row && this.focusedCell.col === col)) {
    event.preventDefault();
    return;
  }

  const key = event.key;

  // Allow only A-Z, a-z, 0-9
  const isValidChar = /^[a-zA-Z0-9]$/.test(key);
  if (!isValidChar) {
    event.preventDefault();
    return;
  }

  // Type character into focused cell
  const field = this.columns[col].field;
  this.data[row][field] = (this.data[row][field] || '') + key;
}
}