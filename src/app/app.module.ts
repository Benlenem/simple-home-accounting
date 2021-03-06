import { CdkTableModule } from '@angular/cdk/table';
import { NgModule, isDevMode } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import {
  DateAdapter, MAT_DATE_FORMATS, MatAutocompleteModule, MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule,
  MatIconModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule,
  MatTabsModule,
  MatSelect,
  MatSelectModule,
  MatButtonToggle,
  MatButtonToggleModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TreeComponent } from './components/tree/tree.component';
import { AppComponent, DialogResultExampleDialogComponent, DialogTwoOptionsDialogComponent } from './app.component';

import { EditTransactionComponent } from './components/edit-transaction/edit-transaction.component';
import { MenuDrawerComponent } from './components/menu-drawer/menu-drawer.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { NgReduxModule, NgRedux, DevToolsExtension } from '@angular-redux/store';
import { AppState, TransactionMap } from './shared/models/app-state';
import { rootReducer, INITIAL_STATE, AppStateActions } from './shared/reducers/app-state-reducer';
import {
  allTransactionsSelector,
} from './shared/selectors/selectors';

import { undoRedoReducer, UndoRedoState, presentSelector } from './shared/reducers/undo-redo-reducer';
import { FiltersComponent } from './components/filters/filters.component';
import { AccountComponent } from './components/account/account.component';
import { AccountsComponent } from './components/accounts/accounts.component';
import { TagComponent } from './components/tag/tag.component';
import { TagsComponent } from './components/tags/tags.component';

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    TreeComponent,
    MenuDrawerComponent,
    TransactionsComponent,
    DialogResultExampleDialogComponent,
    DialogTwoOptionsDialogComponent,
    EditTransactionComponent,
    FiltersComponent,
    AccountComponent,
    AccountsComponent,
    TagComponent,
    TagsComponent,
  ],
  entryComponents: [
    DialogResultExampleDialogComponent,
    DialogTwoOptionsDialogComponent,
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    CdkTableModule,
    MatTableModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    MatCardModule,
    NgReduxModule,
    MatTabsModule,
    MatSelectModule,
    MatButtonToggleModule,
  ],
  providers : [
    {provide: DateAdapter, useClass: MomentDateAdapter},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
})
export class AppModule {
  constructor(
    private ngRedux: NgRedux<UndoRedoState<AppState>>,
    private devTools: DevToolsExtension,
  ) {
    this.ngRedux.configureStore(
      undoRedoReducer<AppState>(rootReducer, [
        AppStateActions.ADD_TRANSACTIONS,
        AppStateActions.DELETE_TRANSACTION,
        AppStateActions.UPDATE_TRANSACTION,
      ]),
      {
       past: [],
       present: INITIAL_STATE,
       future: [],
      },
      [],
      isDevMode() && devTools.isEnabled() ? [devTools.enhancer()] : []);

    this.ngRedux.select(presentSelector(allTransactionsSelector))
    .pipe(distinctUntilChanged())
    .pipe(debounceTime(5000))
    .subscribe( transactions => {
      console.log('save');
      saveTransactions(transactions);
    });

    const t = loadTransactions();
    if (t) {
      console.log('restore');
      this.ngRedux.dispatch(AppStateActions.addTransactions(Object.values(t), true));
    }
  }
}

const loadTransactions = (): TransactionMap | undefined => {
  const serializedTransactions = localStorage.getItem('transactions');

  if (serializedTransactions != null) {
    const loaded = JSON.parse(serializedTransactions);
    return loaded;
  }

  return undefined;
};

const saveTransactions = (transactions: TransactionMap) => {
  const serializedTransactions = JSON.stringify(transactions);
  localStorage.setItem('transactions', serializedTransactions);
};
