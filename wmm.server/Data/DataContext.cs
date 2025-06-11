using Microsoft.EntityFrameworkCore;
using wmm.server.Models;

namespace wmm.server.Data;

public class DataContext : DbContext
{
	public DbSet<MonthlyExpense> MonthlyExpense { get; init; }
	public DbSet<Budget> Budget { get; init; }
	public DbSet<Purchase> Purchase { get; init; }

	public DataContext(DbContextOptions<DataContext> options) : base(options)
	{
	}

	protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
	{
		optionsBuilder.UseSqlite(@"Data source=Data/expenses.db");
	}

	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
	}
}