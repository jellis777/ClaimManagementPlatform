using ClaimManagementApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ClaimManagementApi.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
        {
        }

        public DbSet<Claim> Claims => Set<Claim>();
    }
}