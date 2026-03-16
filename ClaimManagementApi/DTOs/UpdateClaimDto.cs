using System.ComponentModel.DataAnnotations;
namespace ClaimManagementApi.DTOs;

public class UpdateClaimDto
{
    [Required]
    [StringLength(100)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [StringLength(10000)]
    public string Description { get; set; } = string.Empty;

    [Range(0.01, double.MaxValue)]
    public decimal Amount { get; set; }

    [Required]
    [RegularExpression("Pending|UnderReview|Approved|Rejected|Paid")]
    public string Status { get; set; } = string.Empty;

}