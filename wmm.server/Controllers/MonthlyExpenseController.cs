
using Microsoft.AspNetCore.Mvc;
using wmm.server.Interfaces;
using wmm.server.Models;

namespace wmm.server.Controllers;


public class MonthlyExpenseController : BaseController
{
	private readonly IMonthlyExpenseService _monthlyExpenseService;
	public MonthlyExpenseController(IMonthlyExpenseService monthlyExpenseService)
	{
		_monthlyExpenseService = monthlyExpenseService;
	}
	
	[HttpGet]
	public async Task<ActionResult<IEnumerable<MonthlyExpense>>> GetMonthlyExpenses()
	{
		var expenses = await _monthlyExpenseService.GetMonthlyExpenses();
		return Ok(expenses);
	}

	[HttpPost]
	public async Task<IActionResult> AddMonthlyExpense(MonthlyExpense expense)
	{
		if (expense.Amount <= 0)
		{
			var resp = new DynamicResult<MonthlyExpense>
			{
				StatusCode = 400,
				Message = "param 'amount' must be greater than 0"
			};
			return ApiResponse(resp);
		}

		var result = await _monthlyExpenseService.AddMonthlyExpense(expense);
		return ApiResponse(result);
	}


	[HttpPatch]
	public async Task<IActionResult> UpdateMonthlyExpense(MonthlyExpense expense)
	{
		if (expense.Amount <= 0)
		{
			var resp = new DynamicResult<MonthlyExpense>
			{
				StatusCode = 400,
				Message = "param 'amount' must be greater than 0"
			};
			return ApiResponse(resp);
		}

		var result = await _monthlyExpenseService.UpdateMonthlyExpense(expense);
		return ApiResponse(result);
	}

	[HttpDelete]
	public async Task<IActionResult> DeleteMonthlyExpense(int id)
	{
		var result = await _monthlyExpenseService.DeleteMonthlyExpense(id);
		return ApiResponse(result);
	}

	
}