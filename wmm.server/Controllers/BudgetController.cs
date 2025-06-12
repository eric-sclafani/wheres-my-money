using Microsoft.AspNetCore.Mvc;
using wmm.server.Interfaces;
using wmm.server.Models;

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
		var resp = new DynamicResult<Budget>();
		var result = await _budgetService.GetBudget();
		if (result == null)
		{
			resp.StatusCode = 404;
			resp.Message = "Budget record not found";
		}
		else
		{
			resp.Data = result;
		}

		return ApiResponse(resp);



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