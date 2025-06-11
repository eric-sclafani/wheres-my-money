namespace wmm.server.Models;

public class MonthlyExpense
{
	public int Id { get; set; }
	public string? Category { get; set; }
	public int? Amount { get; set; }
	public string? Note { get; set; }
}