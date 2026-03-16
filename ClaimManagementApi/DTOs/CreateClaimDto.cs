using System.ComponentModel.DataAnnotations;

namespace ClaimManagementApi.DTOs
{
    public class CreateClaimDto
    {
        [Required]
        [StringLength(100)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;

        [Range(0.01, double.MaxValue)]
        public decimal Amount { get; set; }
    }
}