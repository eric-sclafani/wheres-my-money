using Microsoft.EntityFrameworkCore;
using wmm.server.Data;
using wmm.server.Interfaces;
using wmm.server.Models;

namespace wmm.server.Services;

public class PurchaseService : BaseService, IPurchaseService
{
	private readonly DataContext _context;

	public PurchaseService(DataContext context) : base(context)
	{
		_context = context;
	}

	public async Task<IEnumerable<Purchase>> GetPurchases()
	{
		return (await _context.Purchase.ToListAsync()).OrderBy(p => p.Date);
	}

	public async Task<DynamicResult<Purchase>> AddPurchase(Purchase purchase)
	{
		var result = await AddEntity(purchase, () => _context.Purchase.Add(purchase));
		return result;
	}

	public async Task<DynamicResult<Purchase>> UpdatePurchase(Purchase purchase)
	{
		var result = new DynamicResult<Purchase>();
		try
		{
			var record = await _context.Purchase.FindAsync(purchase.Id);
			if (record is not null)
			{
				_context.Entry(record).CurrentValues.SetValues(purchase);
				await _context.SaveChangesAsync();
				result.Data = purchase;
			}
			else
			{
				result.Success = false;
				result.StatusCode = 400;
				result.Message = $"Purchase with id '{purchase.Id}' not found";
			}
		}
		catch (Exception e)
		{
			result.Success = false;
			result.Message = e.Message;
			result.StatusCode = 500;
		}

		return result;
	}

	public async Task<DynamicResult<Purchase>> DeletePurchase(int id)
	{
		var result = new DynamicResult<Purchase>();
		try
		{
			var purchase = await _context.Purchase.FindAsync(id);
			if (purchase is not null)
			{
				_context.Purchase.Remove(purchase);
				await _context.SaveChangesAsync();
				result.Data = purchase;
			}
			else
			{
				result.Success = false;
				result.StatusCode = 400;
				result.Message = $"Purchase with id '{id}' not found";
			}
		}
		catch (Exception e)
		{
			result.Success = false;
			result.Message = e.Message;
			result.StatusCode = 500;
		}

		return result;
	}
}