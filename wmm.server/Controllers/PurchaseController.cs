
using Microsoft.AspNetCore.Mvc;
using wmm.server.Interfaces;
using wmm.server.Models;

namespace wmm.server.Controllers;

public class PurchaseController : BaseController
{
	private readonly IPurchaseService _purchaseService;

	public PurchaseController(IPurchaseService purchaseService)
	{
		_purchaseService = purchaseService;
	}
	
	[HttpGet]
	public async Task<ActionResult<IEnumerable<Purchase>>> GetPurchases()
	{
		var purchases = await _purchaseService.GetPurchases();
		return Ok(purchases);
	}

	[HttpPost]
	public async Task<IActionResult> AddPurchase(Purchase purchase)
	{
		if (purchase.Amount <= 0)
		{
			var resp = new DynamicResult<Purchase>
			{
				StatusCode = 400,
				Message = "param 'amount' must be greater than 0"
			};
			return ApiResponse(resp);
		}

		var result = await _purchaseService.AddPurchase(purchase);
		return ApiResponse(result);
	}

	[HttpPatch]
	public async Task<IActionResult> UpdatePurchase(Purchase purchase)
	{
		if (purchase.Amount <= 0)
		{
			var resp = new DynamicResult<Purchase>
			{
				StatusCode = 400,
				Message = "param 'amount' must be greater than 0"
			};
			return ApiResponse(resp);
		}

		var result = await _purchaseService.UpdatePurchase(purchase);
		return ApiResponse(result);
	}

	[HttpDelete]
	public async Task<IActionResult> DeletePurchase(int id)
	{
		var result = await _purchaseService.DeletePurchase(id);
		return ApiResponse(result);
	}
}