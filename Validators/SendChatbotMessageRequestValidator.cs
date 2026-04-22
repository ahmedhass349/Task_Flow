using FluentValidation;
using taskflow.DTOs.Chatbot;

namespace taskflow.Validators
{
    public class SendChatbotMessageRequestValidator : AbstractValidator<SendChatbotMessageRequest>
    {
        public SendChatbotMessageRequestValidator()
        {
            RuleFor(x => x.Text)
                .NotEmpty().WithMessage("Message text is required.")
                .MaximumLength(8000).WithMessage("Message text must not exceed 8000 characters.");

            RuleFor(x => x.FileName)
                .MaximumLength(255).WithMessage("File name must not exceed 255 characters.")
                .When(x => x.FileName != null);

            RuleFor(x => x.FileContent)
                .MaximumLength(500000).WithMessage("File content must not exceed 500,000 characters.")
                .When(x => x.FileContent != null);
        }
    }
}
