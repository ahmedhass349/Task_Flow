using FluentValidation;
using taskflow.DTOs.Chatbot;

namespace taskflow.Validators
{
    public class SendChatbotMessageRequestValidator : AbstractValidator<SendChatbotMessageRequest>
    {
        public SendChatbotMessageRequestValidator()
        {
            RuleFor(x => x.Text)
                .NotEmpty().WithMessage("Message text is required.");
        }
    }
}
