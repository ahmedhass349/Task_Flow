using FluentValidation;
using taskflow.DTOs.Messages;

namespace taskflow.Validators
{
    public class SendMessageRequestValidator : AbstractValidator<SendMessageRequest>
    {
        public SendMessageRequestValidator()
        {
            RuleFor(x => x.ReceiverId)
                .GreaterThan(0).WithMessage("A valid receiver ID is required.");

            RuleFor(x => x.Body)
                .NotEmpty().WithMessage("Message body is required.")
                .MaximumLength(4000).WithMessage("Message body must not exceed 4000 characters.");
        }
    }
}
