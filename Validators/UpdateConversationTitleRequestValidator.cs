using FluentValidation;
using taskflow.DTOs.Chatbot;

namespace taskflow.Validators
{
    public class UpdateConversationTitleRequestValidator : AbstractValidator<UpdateConversationTitleRequest>
    {
        public UpdateConversationTitleRequestValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Title is required.")
                .MaximumLength(200).WithMessage("Title must not exceed 200 characters.");
        }
    }
}
