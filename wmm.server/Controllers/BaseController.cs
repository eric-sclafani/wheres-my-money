using Microsoft.AspNetCore.Mvc;
using wmm.server.Models;

namespace wmm.server.Controllers;

[ApiController]
[Route("api/[controller]/[action]")]
public class BaseController : ControllerBase
{
	protected ObjectResult ApiResponse<T>(DynamicResult<T> result)
	{
		return result.StatusCode switch
		{
			400 => BadRequest(result.Message),
			500 => StatusCode(500, $"Internal server error: {result.Message}"),
			_ => Ok(result)
		};
	}
}