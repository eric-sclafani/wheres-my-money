namespace wmm.server.Models;

public class Purchase
{
	public int Id { get; set; }
	public DateTime Date { get; set; }
	public string? Description { get; set; }
	public string? Vendor { get; set; }
	public string? Tag { get; set; }
	public string? Type { get; set; }
	public double Amount { get; set; }
}