using wmm.server.Models;

namespace wmm.server.Interfaces;

public interface IBudgetService
{
	void CalculateBudget();
	public Task<Budget?> GetBudget();
	public Task<DynamicResult<Budget>> UpdateCashIn(int cashIn);
}