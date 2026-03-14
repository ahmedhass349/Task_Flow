using FluentValidation;
using taskflow.DTOs.Chatbot;

namespace taskflow.Validators
{
    public class CreateConversationRequestValidator : AbstractValidator<CreateConversationRequest>
    {
        public CreateConversationRequestValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required.")
                .MaximumLength(200).WithMessage("Title must not exceed 200 characters.");
        }
    }
}
