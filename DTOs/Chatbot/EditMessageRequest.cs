namespace taskflow.DTOs.Chatbot
{
    public class EditMessageRequest
    {
        public string Text { get; set; } = string.Empty;
        public string ChatMode { get; set; } = "general";
    }
}
