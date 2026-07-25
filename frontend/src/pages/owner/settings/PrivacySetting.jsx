import React from "react";

const PrivacySetting = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-xl font-bold text-slate-800 mb-1">Privacy Setting</h2>
      <p className="text-[14px] text-slate-500 mb-8">Privacy about the system</p>

      <div className="bg-white p-6 md:p-8 rounded-[24px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-slate-600 text-sm md:text-[15px] leading-relaxed space-y-6 mb-8">
        <p>
          We value your privacy and are committed to protecting your personal
          information. By using our dashboard, you agree to the collection and
          use of information as outlined below:
        </p>

        <div>
          <p className="font-semibold text-slate-800 mb-2">1. Information We Collect</p>
          <ul className="list-disc pl-5 space-y-1 mt-1">
            <li>
              Personal details such as your name, email, and contact information
              when you sign up.
            </li>
            <li>
              Business-related data that you provide for AI support services.
            </li>
            <li>
              Usage data (e.g., logins, interactions, and activity within the
              dashboard) to improve performance.
            </li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-slate-800 mb-2">2. How We Use Your Information</p>
          <ul className="list-disc pl-5 space-y-1 mt-1">
            <li>
              To provide AI-powered call and messaging support for your
              business.
            </li>
            <li>To improve and personalize your dashboard experience.</li>
            <li>To ensure account security and prevent unauthorized access.</li>
            <li>
              To send important updates and notifications related to your
              account.
            </li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-slate-800 mb-2">3. Data Protection</p>
          <ul className="list-disc pl-5 space-y-1 mt-1">
            <li>
              We use industry-standard security measures to protect your data.
            </li>
            <li>
              Your information will never be sold or shared with third parties
              without your consent, except as required by law.
            </li>
          </ul>
        </div>

        <div>
          <p className="font-semibold text-slate-800 mb-2">4. User Control</p>
          <ul className="list-disc pl-5 space-y-1 mt-1">
            <li>
              You may update or delete your account information at any time.
            </li>
            <li>You can request access to the data we hold about you.</li>
            <li>
              You may unsubscribe from marketing communications whenever you
              choose.
            </li>
          </ul>
        </div>

        <p>
          <span className="font-semibold text-slate-800">5. A data handling notice</span> clarifying that FireVoice does not store data
          and that transcripts are emailed only.
        </p>

        <div className="space-y-1">
          <p>
            <span className="font-semibold text-slate-800">6. A field to input</span> or update the destination email for transcripts.
          </p>
          <p>
            A confirmation toggle (e.g., "I agree / I understand" about data
            policy).
          </p>
        </div>

        <p>
          <span className="font-semibold text-slate-800">7. Escalation settings:</span> ability to enter a fallback number and define
          keywords or after-hours
        </p>

        <p>
          <span className="font-semibold text-slate-800">8. A preview</span> of the transcript email format, especially for
          restaurants using auto-printing.
        </p>

        <div className="space-y-1">
          <p className="font-semibold text-slate-800 mb-2">9. Contact Us</p>
          <p>
            If you have any questions about this Privacy Policy or how your
            information is handled, please contact our support team at
            [support@firevoice.com].
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacySetting;
