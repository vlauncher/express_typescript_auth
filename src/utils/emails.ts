import nodemailer from "nodemailer";

class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    private async sendEmail(to: string, subject: string, content: string, isHtml: boolean = false) {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            [isHtml ? "html" : "text"]: content,
        };
        try {
            return await this.transporter.sendMail(mailOptions);
        } catch (error: any) {
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }

    public async sendEmailVerification(to: string, token: string) {
        const subject = "Email Verification";
        const text = `Please verify your email by clicking the link: http://localhost:3000/auth/verify?token=${token}`;
        return await this.sendEmail(to, subject, text);
    }

    public async sendEmailVerificationConfirmation(to: string) {
        const subject = "Email Verification Confirmation";
        const text = `Your email has been verified successfully.`;
        return await this.sendEmail(to, subject, text);
    }

    public async sendPasswordReset(to: string, token: string) {
        const subject = "Password Reset";
        const text = `Please reset your password by clicking the link: http://localhost:3000/auth/reset-password?token=${token}`;
        return await this.sendEmail(to, subject, text);
    }

    public async sendPasswordResetConfirmation(to: string) {
        const subject = "Password Reset Confirmation";
        const text = `Your password has been reset successfully.`;
        return await this.sendEmail(to, subject, text);
    }

    async sendPasswordChangeConfirmation(email: string): Promise<void> {
    await this.transporter.sendMail({
      to: email,
      subject: "Password Change Successful",
      html: `<p>Your password has been successfully changed.</p>`,
    });
  }
}

export default EmailService;