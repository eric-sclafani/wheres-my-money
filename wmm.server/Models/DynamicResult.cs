namespace wmm.server.Models;

public class DynamicResult<T>
{
	public int StatusCode { get; set; } = 200;
	public bool Success { get; set; } = true;
	public string Message { get; set; } = "Success!";
	public T? Data { get; set; }
}