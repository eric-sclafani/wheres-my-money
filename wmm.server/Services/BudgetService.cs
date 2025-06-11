using Microsoft.EntityFrameworkCore;
using wmm.server.Data;
using wmm.server.Interfaces;
using wmm.server.Models;

namespace wmm.server.Services;

public class BudgetService : IBudgetService
{
	private readonly DataContext _context;

	public BudgetService(DataContext context)
	{
		_context = context;
	}

	public async void CalculateBudget()
	{
		var budget = _context.Budget.FirstOrDefault();
		var cashOut = _context.MonthlyExpense.Sum(f => f.Amount);
		if (budget is not null && cashOut is not null)
		{	
			budget.CashOut = cashOut ?? 0;
			budget.DisposableIncome = budget.CashIn - cashOut ?? 0;
			await _context.SaveChangesAsync();
		}
	}

	public async Task<Budget?> GetBudget()
	{
		return await _context.Budget.FirstOrDefaultAsync();
	}

	public async Task<DynamicResult<Budget>> UpdateCashIn(int cashIn)
	{
		var result = new DynamicResult<Budget>();
		try
		{
			var record = _context.Budget.FirstOrDefault();
			if (record is not null)
			{
				record.CashIn = cashIn;
				await _context.SaveChangesAsync();
				result.Data = record;
			}
			else
			{
				var budget = new Budget()
				{
					CashIn = cashIn
				};
				_context.Add(budget);
				await _context.SaveChangesAsync();
				result.Data = budget;
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
			CalculateBudget();
		}

		return result;
	}
}