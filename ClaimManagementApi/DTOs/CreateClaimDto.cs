namespace ClaimManagementApi.DTOs
{
    public class CreateClaimDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
    }
}