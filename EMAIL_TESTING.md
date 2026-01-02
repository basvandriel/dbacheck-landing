# Email Testing Guide

This project includes comprehensive email testing capabilities for the DBA Compliance Check landing page.

## Test Modes

### 1. Test Mode (Default)
- **Command**: `npm run test:e2e`
- **Behavior**: Emails are logged to localStorage instead of being sent
- **Purpose**: Safe testing without consuming EmailJS quota or sending real emails
- **Environment**: `VITE_TEST_MODE=true`

### 2. Production Email Test
- **Command**: `npm run test:e2e:production`
- **Behavior**: Sends actual emails via EmailJS
- **Purpose**: Verify real email delivery functionality
- **Environment**: Production mode (no test environment variables)
- **⚠️ Warning**: Consumes EmailJS quota - use sparingly!

## Manual Testing

```bash
# Setup test environment
node test-email.js

# Start dev server
npm run dev

# Then follow the on-screen instructions
```

## Email Configuration

- **Service ID**: `service_e5sgqty`
- **Template ID**: `template_nghge43`
- **Public Key**: `XgaQ6r0hi05rdDRA9`
- **Test Email**: `test@ethereal.email`

## Test Coverage

✅ Form validation
✅ Risk score calculation
✅ Email data formatting
✅ Success state handling
✅ Test mode functionality
✅ Production email delivery (when needed)

## Important Notes

- Production email tests should be run infrequently to avoid quota issues
- Always verify email delivery by checking the test inbox
- Test mode provides full functionality verification without side effects
- All tests include comprehensive assertions for email data structure