namespace taskflow.DTOs.Mongo
{
    public class SendInvitationRequestDto
    {
        public string RecipientEmail { get; set; } = string.Empty;
        public string TeamId { get; set; } = string.Empty;
        public string TeamName { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Role { get; set; } = "Member";
    }
}
