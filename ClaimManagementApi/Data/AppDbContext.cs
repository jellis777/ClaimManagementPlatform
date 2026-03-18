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
        public DbSet<User> Users => Set<User>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Claim>()
                .Property(c => c.Amount)
                .HasPrecision(18, 2);
        }
    }
}