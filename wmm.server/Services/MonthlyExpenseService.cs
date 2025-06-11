using Microsoft.EntityFrameworkCore;
using wmm.server.Data;
using wmm.server.Interfaces;
using wmm.server.Models;

namespace wmm.server.Services;

public class MonthlyExpenseService : BaseService, IMonthlyExpenseService
{
	private readonly DataContext _context;
	private readonly IBudgetService _budgetService;

	public MonthlyExpenseService(DataContext context, IBudgetService budgetService) : base(context)
	{
		_context = context;
		_budgetService = budgetService;
	}

	public async Task<IEnumerable<MonthlyExpense>> GetMonthlyExpenses()
	{
		return await _context.MonthlyExpense.ToListAsync();
	}

	public async Task<DynamicResult<MonthlyExpense>> AddMonthlyExpense(MonthlyExpense expense)
	{
		var result = await AddEntity(expense, () => _context.MonthlyExpense.Add(expense));
		if (result.Success)
		{
			_budgetService.CalculateBudget();
		}

		return result;
	}

	public async Task<DynamicResult<MonthlyExpense>> UpdateMonthlyExpense(MonthlyExpense expense)
	{
		var result = new DynamicResult<MonthlyExpense>();
		try
		{
			var record = await _context.MonthlyExpense.FindAsync(expense.Id);
			if (record is not null)
			{
				_context.Entry(record).CurrentValues.SetValues(expense);
				await _context.SaveChangesAsync();
				result.Data = expense;
			}
			else
			{
				result.Success = false;
				result.StatusCode = 400;
				result.Message = $"Fixed expense with id '{expense.Id}' not found";
			}
		}
		catch (Exception e)
		{
			result.Success = false;
			result.Message = e.Message;
			result.StatusCode = 500;
		}

		if (result.Success)
		{
			_budgetService.CalculateBudget();
		}

		return result;
	}

	public async Task<DynamicResult<MonthlyExpense>> DeleteMonthlyExpense(int id)
	{
		var result = new DynamicResult<MonthlyExpense>();
		try
		{
			var expense = await _context.MonthlyExpense.FindAsync(id);
			if (expense is not null)
			{
				_context.MonthlyExpense.Remove(expense);
				await _context.SaveChangesAsync();
				result.Data = expense;
			}
			else
			{
				result.Success = false;
				result.StatusCode = 400;
				result.Message = $"Fixed expense with id '{id}' not found";
			}
		}
		catch (Exception e)
		{
			result.Success = false;
			result.Message = e.Message;
			result.StatusCode = 500;
		}

		if (result.Success)
		{
			_budgetService.CalculateBudget();
		}

		return result;
	}
}