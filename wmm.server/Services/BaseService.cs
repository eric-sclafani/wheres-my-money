using wmm.server.Data;
using wmm.server.Models;

namespace wmm.server.Services;

public class BaseService
{
	private readonly DataContext _context;

	protected BaseService(DataContext context)
	{
		_context = context;
	}

	protected async Task<DynamicResult<T>> AddEntity<T>(T Data, Action dbChange)
	{
		var result = new DynamicResult<T>();
		try
		{
			dbChange();
			await _context.SaveChangesAsync();
			result.Data = Data;
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