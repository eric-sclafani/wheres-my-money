using wmm.server.Data;
using wmm.server.Interfaces;
using wmm.server.Services;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<DataContext>();
builder.Services.AddTransient<IBudgetService, BudgetService>();
builder.Services.AddTransient<IMonthlyExpenseService, MonthlyExpenseService>();
builder.Services.AddTransient<IPurchaseService, PurchaseService>();

builder.Services.AddCors(options =>
{
	options.AddDefaultPolicy(cfg =>
	{
		cfg.WithOrigins(builder.Configuration["AllowedOrigins"]!);
		cfg.AllowAnyHeader();
		cfg.AllowAnyMethod();
	});

	options.AddPolicy(name: "AnyOrigin", cfg =>
	{
		cfg.AllowAnyOrigin();
		cfg.AllowAnyHeader();
		cfg.AllowAnyMethod();
	});
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
	app.UseSwagger();
	app.UseSwaggerUI();
}

app.UseCors();
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();