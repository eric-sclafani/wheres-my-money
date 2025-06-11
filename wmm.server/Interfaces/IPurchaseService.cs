using wmm.server.Models;

namespace wmm.server.Interfaces;

public interface IPurchaseService
{
	Task<IEnumerable<Purchase>> GetPurchases();
	Task<DynamicResult<Purchase>> AddPurchase(Purchase purchase);
	Task<DynamicResult<Purchase>> UpdatePurchase(Purchase purchase);
	Task<DynamicResult<Purchase>> DeletePurchase(int id);
}