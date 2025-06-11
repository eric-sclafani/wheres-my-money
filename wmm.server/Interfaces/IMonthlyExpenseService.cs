using wmm.server.Models;

namespace wmm.server.Interfaces;

public interface IMonthlyExpenseService
{
	Task<IEnumerable<MonthlyExpense>> GetMonthlyExpenses();
	Task<DynamicResult<MonthlyExpense>> UpdateMonthlyExpense(MonthlyExpense expense);
	Task<DynamicResult<MonthlyExpense>> DeleteMonthlyExpense(int id);
	Task<DynamicResult<MonthlyExpense>> AddMonthlyExpense(MonthlyExpense expense);
}