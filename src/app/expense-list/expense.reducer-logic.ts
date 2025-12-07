import { Expense, ExpenseState } from "./expense.types";

export const SelectExpense = (state: ExpenseState, action: { ExpenseId: number }) => {
  let newState: ExpenseState = {
    ...state
  };
  // make sure the selected Expense exists
  if (state.expenses.some((item: Expense): boolean => item.id === action.ExpenseId)) {
    newState.selectedexpenseId = action.ExpenseId
  }
  return newState;
}

export const SetExpenseForm = (state: ExpenseState, action: { Expense: Expense }) => {
  const ExpenseForm: Expense = <Expense>JSON.parse(JSON.stringify(action.Expense));
  return {
    ...state,
    ExpenseForm
  }
}

export const UpdateExpense = (state: ExpenseState) => {
  return {
    ...state,
    isExpenseUpdating: true,
  }
}

export const UpdateExpenseError = (state: ExpenseState) => {
  return {
    ...state,
    isExpenseUpdating: false,
  }
}

export const UpdateExpenseSuccess = (state: ExpenseState) => {
    return {
        ...state,
        isExpenseUpdating: false,
    }
}