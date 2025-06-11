using Microsoft.AspNetCore.Mvc;
using wmm.server.Interfaces;
using wmm.server.Models;
using wmm.server.Services;

namespace wmm.server.Controllers;

public class BudgetController : BaseController
{
	private readonly IBudgetService _budgetService;

	public BudgetController(IBudgetService budgetService)
	{
		_budgetService = budgetService;
	}
	
	[HttpGet]
	public async Task<IActionResult> GetBudget()
	{
		var result = await _budgetService.GetBudget();
		return result != null ? Ok(result) : NotFound("Budget record not found");
	}

	[HttpPost]
	public async Task<IActionResult> SetCashIn(Budget budget)
	{
		if (budget.CashIn <= 0)
		{
			var resp = new DynamicResult<Budget>
			{
				StatusCode = 400,
				Message = "param 'cashIn' must be greater than 0"
			};
			return ApiResponse(resp);
		}

		var result = await _budgetService.UpdateCashIn(budget.CashIn);
		return ApiResponse(result);
	}
}