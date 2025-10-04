import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ContactForm from '../ContactForm';

// Mock the fetch API
global.fetch = jest.fn();

describe('ContactForm', () => {
  beforeEach(() => {
    // Reset the fetch mock before each test
    (global.fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Form Rendering', () => {
    it('renders all form fields correctly', () => {
      render(<ContactForm />);

      // Check for all input fields
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/what is this regarding/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    });

    it('renders submit button with correct text', () => {
      render(<ContactForm />);

      const submitButton = screen.getByRole('button', { name: /send message/i });
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
    });

    it('renders all category options', () => {
      render(<ContactForm />);

      const categorySelect = screen.getByLabelText(/what is this regarding/i);
      expect(categorySelect).toBeInTheDocument();

      // Check for all options
      expect(screen.getByRole('option', { name: /general inquiry/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /music \/ performance booking/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /music collaboration/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /software engineering \/ consulting/i })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: /other/i })).toBeInTheDocument();
    });

    it('has all required fields marked as required', () => {
      render(<ContactForm />);

      expect(screen.getByLabelText(/name/i)).toBeRequired();
      expect(screen.getByLabelText(/email/i)).toBeRequired();
      expect(screen.getByLabelText(/subject/i)).toBeRequired();
      expect(screen.getByLabelText(/message/i)).toBeRequired();
      expect(screen.getByLabelText(/what is this regarding/i)).toBeRequired();
    });

    it('has correct input types', () => {
      render(<ContactForm />);

      expect(screen.getByLabelText(/name/i)).toHaveAttribute('type', 'text');
      expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'email');
      expect(screen.getByLabelText(/subject/i)).toHaveAttribute('type', 'text');
    });

    it('displays placeholders for all fields', () => {
      render(<ContactForm />);

      expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/your\.email@example\.com/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/brief subject line/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/tell me more about your inquiry/i)).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('validates email format using HTML5 validation', () => {
      render(<ContactForm />);

      const emailInput = screen.getByLabelText(/email/i);
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('prevents submission with empty fields due to required attributes', async () => {
      render(<ContactForm />);
      const user = userEvent.setup();

      const submitButton = screen.getByRole('button', { name: /send message/i });

      // Try to submit without filling anything
      await user.click(submitButton);

      // The form should not call fetch because HTML5 validation prevents submission
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('User Interactions', () => {
    it('allows user to type in name field', async () => {
      render(<ContactForm />);
      const user = userEvent.setup();

      const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
      await user.type(nameInput, 'John Doe');

      expect(nameInput.value).toBe('John Doe');
    });

    it('allows user to type in email field', async () => {
      render(<ContactForm />);
      const user = userEvent.setup();

      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      await user.type(emailInput, 'john@example.com');

      expect(emailInput.value).toBe('john@example.com');
    });

    it('allows user to type in subject field', async () => {
      render(<ContactForm />);
      const user = userEvent.setup();

      const subjectInput = screen.getByLabelText(/subject/i) as HTMLInputElement;
      await user.type(subjectInput, 'Test Subject');

      expect(subjectInput.value).toBe('Test Subject');
    });

    it('allows user to type in message field', async () => {
      render(<ContactForm />);
      const user = userEvent.setup();

      const messageInput = screen.getByLabelText(/message/i) as HTMLTextAreaElement;
      await user.type(messageInput, 'This is a test message');

      expect(messageInput.value).toBe('This is a test message');
    });

    it('allows user to select a category', async () => {
      render(<ContactForm />);
      const user = userEvent.setup();

      const categorySelect = screen.getByLabelText(/what is this regarding/i) as HTMLSelectElement;

      // Default value should be 'general'
      expect(categorySelect.value).toBe('general');

      // Change to music
      await user.selectOptions(categorySelect, 'music');
      expect(categorySelect.value).toBe('music');

      // Change to engineering
      await user.selectOptions(categorySelect, 'engineering');
      expect(categorySelect.value).toBe('engineering');
    });

    it('updates all form fields correctly when user types', async () => {
      render(<ContactForm />);
      const user = userEvent.setup();

      const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
      const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
      const subjectInput = screen.getByLabelText(/subject/i) as HTMLInputElement;
      const messageInput = screen.getByLabelText(/message/i) as HTMLTextAreaElement;
      const categorySelect = screen.getByLabelText(/what is this regarding/i) as HTMLSelectElement;

      await user.type(nameInput, 'Jane Smith');
      await user.type(emailInput, 'jane@example.com');
      await user.selectOptions(categorySelect, 'collaboration');
      await user.type(subjectInput, 'Music Collaboration Inquiry');
      await user.type(messageInput, 'I would love to collaborate on a project.');

      expect(nameInput.value).toBe('Jane Smith');
      expect(emailInput.value).toBe('jane@example.com');
      expect(categorySelect.value).toBe('collaboration');
      expect(subjectInput.value).toBe('Music Collaboration Inquiry');
      expect(messageInput.value).toBe('I would love to collaborate on a project.');
    });
  });

  describe('Form Submission Flow', () => {
    const fillForm = async (user: ReturnType<typeof userEvent.setup>) => {
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const subjectInput = screen.getByLabelText(/subject/i);
      const messageInput = screen.getByLabelText(/message/i);

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(subjectInput, 'Test Subject');
      await user.type(messageInput, 'Test Message');
    };

    it('submits form with correct data when all fields are filled', async () => {
      render(<ContactForm />);
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await fillForm(user);

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(1);
      });

      expect(global.fetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'John Doe',
          email: 'john@example.com',
          subject: 'Test Subject',
          category: 'general',
          message: 'Test Message',
        }),
      });
    });

    it('shows loading state during submission', async () => {
      render(<ContactForm />);
      const user = userEvent.setup();

      // Mock a delayed response
      (global.fetch as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ success: true }),
                }),
              100
            )
          )
      );

      await fillForm(user);

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      // Check for loading state
      await waitFor(() => {
        expect(screen.getByText(/sending.../i)).toBeInTheDocument();
      });

      // Button should be disabled during submission
      expect(submitButton).toBeDisabled();
    });

    it('disables submit button during submission', async () => {
      render(<ContactForm />);
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({ success: true }),
                }),
              100
            )
          )
      );

      await fillForm(user);

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });
    });

    it('includes selected category in submission', async () => {
      render(<ContactForm />);
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      const categorySelect = screen.getByLabelText(/what is this regarding/i);
      await user.selectOptions(categorySelect, 'music');

      await fillForm(user);

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalled();
      });

      const callBody = JSON.parse((global.fetch as jest.Mock).mock.calls[0][1].body);
      expect(callBody.category).toBe('music');
    });
  });

  describe('Success Handling', () => {
    const fillForm = async (user: ReturnType<typeof userEvent.setup>) => {
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/subject/i), 'Test Subject');
      await user.type(screen.getByLabelText(/message/i), 'Test Message');
    };

    it('displays success message after successful submission', async () => {
      render(<ContactForm />);
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await fillForm(user);

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
      });
    });

    it('shows success icon in success message', async () => {
      render(<ContactForm />);
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await fillForm(user);

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        const successMessage = screen.getByText(/message sent successfully/i);
        expect(successMessage).toBeInTheDocument();
        // Check that the parent container has the success styling
        const successContainer = successMessage.closest('div.bg-green-900\\/30');
        expect(successContainer).toBeInTheDocument();
      });
    });

    it('clears form fields after successful submission', async () => {
      render(<ContactForm />);
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await fillForm(user);

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
      });

      // Check that all fields are cleared
      expect(screen.getByLabelText(/name/i)).toHaveValue('');
      expect(screen.getByLabelText(/email/i)).toHaveValue('');
      expect(screen.getByLabelText(/subject/i)).toHaveValue('');
      expect(screen.getByLabelText(/message/i)).toHaveValue('');
      expect(screen.getByLabelText(/what is this regarding/i)).toHaveValue('general');
    });

    it('resets submit button to normal state after success', async () => {
      render(<ContactForm />);
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await fillForm(user);

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
      });

      // Button should be enabled again
      expect(submitButton).not.toBeDisabled();
      expect(screen.getByText(/send message/i)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    const fillForm = async (user: ReturnType<typeof userEvent.setup>) => {
      await user.type(screen.getByLabelText(/name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email/i), 'john@example.com');
      await user.type(screen.getByLabelText(/subject/i), 'Test Subject');
      await user.type(screen.getByLabelText(/message/i), 'Test Message');
    };

    it('displays error message when submission fails', async () => {
      render(<ContactForm />);
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await fillForm(user);

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getAllByText(/failed to send message/i).length).toBeGreaterThan(0);
      });
    });

    it('displays error message when network request fails', async () => {
      render(<ContactForm />);
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await fillForm(user);

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getAllByText(/failed to send message/i).length).toBeGreaterThan(0);
      });
    });

    it('shows error icon in error message', async () => {
      render(<ContactForm />);
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await fillForm(user);

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        const errorMessages = screen.getAllByText(/failed to send message/i);
        expect(errorMessages.length).toBeGreaterThan(0);
        // Check that the parent container has the error styling
        const errorContainer = errorMessages[0].closest('div.bg-red-900\\/30');
        expect(errorContainer).toBeInTheDocument();
      });
    });

    it('displays custom error message from Error object', async () => {
      render(<ContactForm />);
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Custom error message'));

      await fillForm(user);

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/custom error message/i)).toBeInTheDocument();
      });
    });

    it('displays generic error message for non-Error failures', async () => {
      render(<ContactForm />);
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockRejectedValueOnce('String error');

      await fillForm(user);

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/an error occurred/i)).toBeInTheDocument();
      });
    });

    it('keeps form data when submission fails', async () => {
      render(<ContactForm />);
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await fillForm(user);

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getAllByText(/failed to send message/i).length).toBeGreaterThan(0);
      });

      // Form data should still be there
      expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
      expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com');
      expect(screen.getByLabelText(/subject/i)).toHaveValue('Test Subject');
      expect(screen.getByLabelText(/message/i)).toHaveValue('Test Message');
    });

    it('re-enables submit button after error', async () => {
      render(<ContactForm />);
      const user = userEvent.setup();

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await fillForm(user);

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getAllByText(/failed to send message/i).length).toBeGreaterThan(0);
      });

      // Button should be enabled again for retry
      expect(submitButton).not.toBeDisabled();
    });

    it('allows retry after error', async () => {
      render(<ContactForm />);
      const user = userEvent.setup();

      // First attempt fails
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await fillForm(user);

      let submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getAllByText(/failed to send message/i).length).toBeGreaterThan(0);
      });

      // Second attempt succeeds
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
      });

      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('clears previous error message on new submission', async () => {
      render(<ContactForm />);
      const user = userEvent.setup();

      // First attempt fails
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });

      await fillForm(user);

      let submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getAllByText(/failed to send message/i).length).toBeGreaterThan(0);
      });

      // Second attempt succeeds
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.queryByText(/failed to send message/i)).not.toBeInTheDocument();
        expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper labels for all form fields', () => {
      render(<ContactForm />);

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/what is this regarding/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    });

    it('associates labels with inputs correctly', () => {
      render(<ContactForm />);

      const nameLabel = screen.getByText(/name \*/i);
      const emailLabel = screen.getByText(/email \*/i);
      const subjectLabel = screen.getByText(/subject \*/i);
      const messageLabel = screen.getByText(/message \*/i);

      expect(nameLabel).toHaveAttribute('for', 'name');
      expect(emailLabel).toHaveAttribute('for', 'email');
      expect(subjectLabel).toHaveAttribute('for', 'subject');
      expect(messageLabel).toHaveAttribute('for', 'message');
    });

    it('has accessible submit button', () => {
      render(<ContactForm />);

      const submitButton = screen.getByRole('button', { name: /send message/i });
      expect(submitButton).toHaveAttribute('type', 'submit');
    });
  });
});
