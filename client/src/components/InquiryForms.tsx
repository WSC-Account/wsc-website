import { useState, type FormEvent } from "react";
import { submitWebsiteForm, type WebsiteFormAttachment, type WebsiteFormType } from "@/lib/forms";
import { useFormProtection } from "@/hooks/useFormProtection";
import { notifyError, notifySuccess } from "@/lib/notify";

type FormTone = "light" | "dark";
type FormStatus = { type: "success" | "error"; message: string } | null;
type FormValue = string | string[];
type BaseState = Record<string, FormValue>;

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  tone: FormTone;
  required?: boolean;
  autoComplete?: string;
  type?: string;
  placeholder?: string;
};

type SelectFieldProps = FieldProps & {
  options: string[];
};

type TextAreaFieldProps = Omit<FieldProps, "type" | "autoComplete"> & {
  rows?: number;
};

type RadioOption = {
  label: string;
  value: string;
};

type RadioGroupProps = {
  id: string;
  label: string;
  value: string;
  options: RadioOption[];
  onChange: (value: string) => void;
  tone: FormTone;
  required?: boolean;
};

type CheckboxGroupProps = {
  id: string;
  label: string;
  values: string[];
  options: RadioOption[];
  onChange: (values: string[]) => void;
  tone: FormTone;
};

type SubmitOptions<T extends BaseState> = {
  formType: WebsiteFormType;
  formName: string;
  source: string;
  successMessage: string;
  fallbackError: string;
  buildPayload: (state: T) => {
    name?: string;
    email: string;
    phone?: string;
    subject?: string;
    message?: string;
    metadata?: Record<string, string | number | boolean | null | undefined>;
    attachments?: WebsiteFormAttachment[];
  } | Promise<{
    name?: string;
    email: string;
    phone?: string;
    subject?: string;
    message?: string;
    metadata?: Record<string, string | number | boolean | null | undefined>;
    attachments?: WebsiteFormAttachment[];
  }>;
};

const textInputBase =
  "w-full border px-4 py-3 text-[14px] transition-colors duration-200 focus:outline-none";
const lightInputClass =
  `${textInputBase} bg-parchment-mid border-wsc-border text-ink placeholder:text-ink-light focus:border-volt`;
const darkInputClass =
  `${textInputBase} bg-dark-bg border-parchment/15 text-parchment placeholder:text-parchment/55 focus:border-volt-bright`;
const lightLabelClass = "block text-ink-light text-[11px] tracking-[0.14em] uppercase mb-2";
const darkLabelClass = "block text-parchment/70 text-[11px] tracking-[0.14em] uppercase mb-2";

const cancellationReasons = [
  "Relocating/Moving",
  "Financial Reasons",
  "Facility/Equipment Concerns",
  "Scheduling/Availability Issues",
  "Staff/Coaching Concerns",
  "Joining a Different Club",
];

const departmentOptions = [
  "Tennis",
  "Operations",
  "Camps & Youth Activities",
  "Fitness",
  "Golf",
];

const golfSkillLevels = ["Beginner", "Intermediate", "Advanced"];

const newsletterInterests = [
  { label: "Tennis updates", value: "Tennis updates" },
  { label: "Golf updates", value: "Golf updates" },
  { label: "APL fitness updates", value: "APL fitness updates" },
  { label: "Pickleball updates", value: "Pickleball updates" },
  { label: "Summer camp updates", value: "Summer camp updates" },
  { label: "Private events and club news", value: "Private events and club news" },
];

function classForTone(tone: FormTone) {
  return {
    input: tone === "dark" ? darkInputClass : lightInputClass,
    label: tone === "dark" ? darkLabelClass : lightLabelClass,
    text: tone === "dark" ? "text-parchment/80" : "text-ink-mid",
    statusSuccess: tone === "dark" ? "text-parchment" : "text-ink",
    statusError: tone === "dark" ? "text-red-200" : "text-red-700",
    buttonIdle:
      tone === "dark"
        ? "bg-volt-bright text-dark-bg hover:bg-parchment hover:text-dark-bg"
        : "bg-volt-bright text-dark-bg hover:bg-parchment-dark",
    buttonDisabled:
      tone === "dark"
        ? "bg-parchment/20 text-parchment/70 cursor-default"
        : "bg-ink/15 text-ink-mid cursor-default",
    radioBorder: tone === "dark" ? "border-parchment/15" : "border-wsc-border",
  };
}

function fieldValue(state: BaseState, key: string) {
  const value = state[key];
  return typeof value === "string" ? value : "";
}

function fullName(state: BaseState, firstKey = "firstName", lastKey = "lastName") {
  return `${fieldValue(state, firstKey)} ${fieldValue(state, lastKey)}`.trim();
}

function useInquirySubmit<T extends BaseState>(initialState: T, options: SubmitOptions<T>) {
  const [form, setForm] = useState<T>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<FormStatus>(null);
  const { honeypotProps, validateSubmission } = useFormProtection(1);

  const update = (key: keyof T, value: FormValue) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const check = validateSubmission();

    if (!check.valid) {
      if (check.reason === "honeypot" || check.reason === "too_fast") {
        setStatus({ type: "success", message: options.successMessage });
        notifySuccess(options.successMessage);
        setForm(initialState);
        return;
      }

      if (check.reason === "rate_limited") {
        const message = "Please wait a moment before submitting another request.";
        setStatus({ type: "error", message });
        notifyError(message);
        return;
      }
    }

    setIsSubmitting(true);
    setStatus(null);

    try {
      const payload = await options.buildPayload(form);
      await submitWebsiteForm({
        formType: options.formType,
        source: options.source,
        formName: options.formName,
        ...payload,
      });

      setStatus({ type: "success", message: options.successMessage });
      notifySuccess(options.successMessage);
      setForm(initialState);
    } catch (error) {
      const message = error instanceof Error ? error.message : options.fallbackError;
      setStatus({ type: "error", message: message || options.fallbackError });
      notifyError(message || options.fallbackError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { form, update, submit, isSubmitting, status, honeypotProps };
}

function TextField({
  id,
  label,
  value,
  onChange,
  tone,
  required = false,
  autoComplete,
  type = "text",
  placeholder,
}: FieldProps) {
  const styles = classForTone(tone);

  return (
    <div>
      <label htmlFor={id} className={styles.label}>
        {label}{required ? " *" : ""}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={styles.input}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
      />
    </div>
  );
}

function TextAreaField({
  id,
  label,
  value,
  onChange,
  tone,
  required = false,
  placeholder,
  rows = 4,
}: TextAreaFieldProps) {
  const styles = classForTone(tone);

  return (
    <div>
      <label htmlFor={id} className={styles.label}>
        {label}{required ? " *" : ""}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${styles.input} resize-none`}
        required={required}
        placeholder={placeholder}
        rows={rows}
      />
    </div>
  );
}

function SelectField({ id, label, value, onChange, tone, required = false, options }: SelectFieldProps) {
  const styles = classForTone(tone);

  return (
    <div>
      <label htmlFor={id} className={styles.label}>
        {label}{required ? " *" : ""}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${styles.input} ${!value ? (tone === "dark" ? "text-parchment/55" : "text-ink-light") : ""}`}
        required={required}
      >
        <option value="">Choose an option</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function RadioGroupField({ id, label, value, options, onChange, tone, required = false }: RadioGroupProps) {
  const styles = classForTone(tone);

  return (
    <fieldset className={`border ${styles.radioBorder} px-4 py-4`}>
      <legend className={styles.label}>
        {label}{required ? " *" : ""}
      </legend>
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
        {options.map((option) => (
          <label key={option.value} className={`inline-flex items-center gap-2 text-[13px] ${styles.text}`}>
            <input
              type="radio"
              name={id}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              required={required}
              className="accent-volt"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function CheckboxGroupField({ id, label, values, options, onChange, tone }: CheckboxGroupProps) {
  const styles = classForTone(tone);

  const toggle = (value: string) => {
    onChange(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  };

  return (
    <fieldset className={`border ${styles.radioBorder} px-4 py-4`}>
      <legend className={styles.label}>{label}</legend>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((option) => (
          <label key={option.value} className={`inline-flex items-center gap-2 text-[13px] ${styles.text}`}>
            <input
              type="checkbox"
              name={id}
              value={option.value}
              checked={values.includes(option.value)}
              onChange={() => toggle(option.value)}
              className="accent-volt"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function SubmitArea({
  tone,
  isSubmitting,
  status,
  buttonLabel,
  loadingLabel,
  note,
}: {
  tone: FormTone;
  isSubmitting: boolean;
  status: FormStatus;
  buttonLabel: string;
  loadingLabel?: string;
  note?: string;
}) {
  const styles = classForTone(tone);

  return (
    <>
      {status ? (
        <p
          role={status.type === "error" ? "alert" : "status"}
          className={`text-[13px] leading-[1.6] ${
            status.type === "error" ? styles.statusError : styles.statusSuccess
          }`}
        >
          {status.message}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`text-[12px] tracking-[0.14em] uppercase px-8 py-3.5 transition-colors duration-200 ${
          isSubmitting ? styles.buttonDisabled : styles.buttonIdle
        }`}
      >
        {isSubmitting ? loadingLabel || "Sending..." : buttonLabel}
      </button>
      {note ? <p className={`text-[12px] leading-[1.65] ${styles.text}`}>{note}</p> : null}
    </>
  );
}

async function attachmentFromFile(file: File): Promise<WebsiteFormAttachment> {
  const contentBase64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      resolve(result.split(",")[1] || "");
    };
    reader.onerror = () => reject(reader.error || new Error("Could not read the selected resume."));
    reader.readAsDataURL(file);
  });

  return {
    name: file.name,
    contentType: file.type || "application/octet-stream",
    contentBase64,
  };
}

export function MemberCancellationForm({ tone = "light", source = "/member-request" }: { tone?: FormTone; source?: string }) {
  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    reason: "",
    reasonDetails: "",
    improvements: "",
    discussionPreference: "",
  };
  const { form, update, submit, isSubmitting, status, honeypotProps } = useInquirySubmit(initialState, {
    formType: "member_cancellation",
    formName: "Membership Cancellation Requests",
    source,
    successMessage: "Cancellation request submitted. WSC will review your request and follow up shortly.",
    fallbackError: "We could not submit your cancellation request. Please try again or email info@woodinvillesportsclub.com.",
    buildPayload: (state) => ({
      name: fullName(state),
      email: state.email,
      phone: state.phone,
      subject: `Membership cancellation request from ${fullName(state)}`,
      message: state.reasonDetails,
      metadata: {
        reason: state.reason,
        improvements: state.improvements,
        discussionPreference: state.discussionPreference,
      },
    }),
  });

  return (
    <form onSubmit={submit} data-form-name="Membership Cancellation Requests" className="space-y-5">
      <NameFields form={form} update={update} tone={tone} prefix="member-cancel" />
      <ContactFields form={form} update={update} tone={tone} prefix="member-cancel" phoneRequired />
      <SelectField
        id="member-cancel-reason"
        label="What's the primary reason for canceling?"
        value={form.reason}
        onChange={(value) => update("reason", value)}
        options={cancellationReasons}
        tone={tone}
        required
      />
      <TextAreaField
        id="member-cancel-details"
        label="Please provide more details regarding your above cancellation reason."
        value={form.reasonDetails}
        onChange={(value) => update("reasonDetails", value)}
        tone={tone}
        required
      />
      <TextAreaField
        id="member-cancel-improvements"
        label="Is there anything we could have done better?"
        value={form.improvements}
        onChange={(value) => update("improvements", value)}
        tone={tone}
        required
      />
      <SelectField
        id="member-cancel-discussion"
        label="Are you open to discussing options before finalizing your cancellation?"
        value={form.discussionPreference}
        onChange={(value) => update("discussionPreference", value)}
        options={["Sure, I'm open to having a discussion.", "No. I'm sure I want to leave."]}
        tone={tone}
      />
      <input {...honeypotProps} />
      <SubmitArea tone={tone} isSubmitting={isSubmitting} status={status} buttonLabel="Submit Request" />
    </form>
  );
}

export function PersonalTrainingRequestForm({ tone = "light", source = "/personal-training-interest-form" }: { tone?: FormTone; source?: string }) {
  const initialState = {
    trainingFor: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    injury: "",
    goals: "",
    experience: "",
    playingSport: "",
    frequency: "",
    availability: "",
    smallGroup: "",
    comments: "",
  };
  const { form, update, submit, isSubmitting, status, honeypotProps } = useInquirySubmit(initialState, {
    formType: "personal_training",
    formName: "Personal Training Interest Form",
    source,
    successMessage: "Personal training request submitted. The WSC team will be in touch shortly.",
    fallbackError: "We could not submit your personal training request. Please try again or email info@woodinvillesportsclub.com.",
    buildPayload: (state) => ({
      name: fullName(state),
      email: state.email,
      phone: state.phone,
      subject: `Personal training request from ${fullName(state)}`,
      message: state.goals || state.comments,
      metadata: {
        trainingFor: state.trainingFor,
        injury: state.injury,
        experience: state.experience,
        playingSport: state.playingSport,
        preferredTrainingFrequency: state.frequency,
        availability: state.availability,
        openToSmallGroupTraining: state.smallGroup,
        comments: state.comments,
      },
    }),
  });

  return (
    <form onSubmit={submit} data-form-name="Personal Training Interest Form" className="space-y-5">
      <RadioGroupField
        id="training-for"
        label="Is this for an adult or child?"
        value={form.trainingFor}
        onChange={(value) => update("trainingFor", value)}
        options={[{ label: "Adult", value: "Adult" }, { label: "Child", value: "Child" }]}
        tone={tone}
      />
      <NameFields form={form} update={update} tone={tone} prefix="personal-training" />
      <ContactFields form={form} update={update} tone={tone} prefix="personal-training" phoneRequired />
      <TextAreaField id="training-injury" label="Do you currently have an injury?" value={form.injury} onChange={(value) => update("injury", value)} tone={tone} />
      <TextAreaField
        id="training-goals"
        label="What are the primary reasons you're interested in personal training? Why did you decide now is the time to do it?"
        value={form.goals}
        onChange={(value) => update("goals", value)}
        tone={tone}
      />
      <TextAreaField
        id="training-experience"
        label="What is your experience level with personal training (e.g. new to it, some experience, seasoned veteran)"
        value={form.experience}
        onChange={(value) => update("experience", value)}
        tone={tone}
      />
      <RadioGroupField
        id="playing-sport"
        label="Are you currently playing a sport?"
        value={form.playingSport}
        onChange={(value) => update("playingSport", value)}
        options={[{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }]}
        tone={tone}
      />
      <TextAreaField id="training-frequency" label="What is your preferred training frequency?" value={form.frequency} onChange={(value) => update("frequency", value)} tone={tone} />
      <TextAreaField
        id="training-availability"
        label="What is your availability for training (e.g. weekdays/weekends, morning/afternoon/evening)"
        value={form.availability}
        onChange={(value) => update("availability", value)}
        tone={tone}
      />
      <RadioGroupField
        id="small-group"
        label="Are you open to Small Group Training?"
        value={form.smallGroup}
        onChange={(value) => update("smallGroup", value)}
        options={[{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }, { label: "Possibly", value: "Possibly" }]}
        tone={tone}
      />
      <TextAreaField id="training-comments" label="Additional Questions/Comments" value={form.comments} onChange={(value) => update("comments", value)} tone={tone} />
      <input {...honeypotProps} />
      <SubmitArea tone={tone} isSubmitting={isSubmitting} status={status} buttonLabel="Submit" />
    </form>
  );
}

export function GolfLessonInquiryForm({ tone = "dark", source = "/golf" }: { tone?: FormTone; source?: string }) {
  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    skillLevel: "",
    golfExperience: "",
  };
  const { form, update, submit, isSubmitting, status, honeypotProps } = useInquirySubmit(initialState, {
    formType: "golf_lesson",
    formName: "Golf Lessons Inquiry",
    source,
    successMessage: "Golf lesson inquiry submitted. Our golf staff will contact you within 1-2 business days.",
    fallbackError: "We could not submit your golf lesson inquiry. Please try again or email info@woodinvillesportsclub.com.",
    buildPayload: (state) => ({
      name: fullName(state),
      email: state.email,
      phone: state.phone,
      subject: `Golf lesson inquiry from ${fullName(state)}`,
      message: state.golfExperience,
      metadata: {
        skillLevel: state.skillLevel,
      },
    }),
  });

  return (
    <form onSubmit={submit} data-form-name="Golf Lessons Inquiry" className="space-y-5">
      <NameFields form={form} update={update} tone={tone} prefix="golf-lesson" />
      <ContactFields form={form} update={update} tone={tone} prefix="golf-lesson" phoneRequired />
      <SelectField id="golf-skill-level" label="Skill Level" value={form.skillLevel} onChange={(value) => update("skillLevel", value)} options={golfSkillLevels} tone={tone} required />
      <TextAreaField
        id="golf-experience"
        label="Tell us a little about your golf experience and what you're looking for."
        value={form.golfExperience}
        onChange={(value) => update("golfExperience", value)}
        tone={tone}
        required
      />
      <input {...honeypotProps} />
      <SubmitArea
        tone={tone}
        isSubmitting={isSubmitting}
        status={status}
        buttonLabel="Submit"
        note="Our golf staff will review your request and reach out within 1-2 business days."
      />
    </form>
  );
}

export function PrivateEventsInquiryForm({ tone = "dark", source = "/events" }: { tone?: FormTone; source?: string }) {
  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    eventDetails: "",
  };
  const { form, update, submit, isSubmitting, status, honeypotProps } = useInquirySubmit(initialState, {
    formType: "private_event",
    formName: "Private Events Inquiry",
    source,
    successMessage: "Event inquiry sent. WSC will follow up to help plan your event.",
    fallbackError: "We could not submit your event inquiry. Please try again or email info@woodinvillesportsclub.com.",
    buildPayload: (state) => ({
      name: fullName(state),
      email: state.email,
      phone: state.phone,
      subject: `Private event inquiry from ${fullName(state) || state.email}`,
      message: state.eventDetails || "No event details provided.",
    }),
  });

  return (
    <form onSubmit={submit} data-form-name="Private Events Inquiry" className="space-y-5">
      <NameFields form={form} update={update} tone={tone} prefix="private-event" required={false} />
      <ContactFields form={form} update={update} tone={tone} prefix="private-event" emailRequired phoneRequired={false} />
      <TextAreaField id="event-details" label="Tell Us About Your Event" value={form.eventDetails} onChange={(value) => update("eventDetails", value)} tone={tone} />
      <input {...honeypotProps} />
      <SubmitArea tone={tone} isSubmitting={isSubmitting} status={status} buttonLabel="Send" />
    </form>
  );
}

export function CareersApplicationForm({ tone = "dark", source = "/careers" }: { tone?: FormTone; source?: string }) {
  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    startDate: "",
    roleDetails: "",
    workAuthorization: "",
    sponsorshipRequirement: "",
  };
  const [resume, setResume] = useState<File | null>(null);
  const { form, update, submit, isSubmitting, status, honeypotProps } = useInquirySubmit(initialState, {
    formType: "career_application",
    formName: "Careers Application Form",
    source,
    successMessage: "Application submitted. Thank you for your interest in working at WSC.",
    fallbackError: "We could not submit your application. Please try again or email info@woodinvillesportsclub.com.",
    buildPayload: async (state) => {
      let attachments: WebsiteFormAttachment[] | undefined;

      if (resume) {
        if (resume.size > 2_500_000) {
          throw new Error("Please upload a resume smaller than 2.5 MB.");
        }
        attachments = [await attachmentFromFile(resume)];
      }

      return {
        name: fullName(state),
        email: state.email,
        phone: state.phone,
        subject: `Career application from ${fullName(state)}`,
        message: state.roleDetails || "No additional role details provided.",
        metadata: {
          department: state.department,
          availableStartDate: state.startDate,
          workAuthorization: state.workAuthorization,
          sponsorshipRequirement: state.sponsorshipRequirement,
          resumeFileName: resume?.name || "",
        },
        attachments,
      };
    },
  });
  const styles = classForTone(tone);

  return (
    <form onSubmit={submit} data-form-name="Careers Application Form" className="space-y-5">
      <NameFields form={form} update={update} tone={tone} prefix="careers" />
      <ContactFields form={form} update={update} tone={tone} prefix="careers" phoneRequired />
      <SelectField id="careers-department" label="Department Applying For" value={form.department} onChange={(value) => update("department", value)} options={departmentOptions} tone={tone} required />
      <TextField id="careers-start-date" label="Available Start Date" value={form.startDate} onChange={(value) => update("startDate", value)} tone={tone} placeholder="MM/DD/YYYY" />
      <TextAreaField
        id="careers-role-details"
        label="Additional details of the role you are interested in"
        value={form.roleDetails}
        onChange={(value) => update("roleDetails", value)}
        tone={tone}
        placeholder="Your response here"
      />
      <div>
        <label htmlFor="careers-resume" className={styles.label}>Upload Resume</label>
        <input
          id="careers-resume"
          type="file"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={(event) => setResume(event.target.files?.[0] || null)}
          className={`${styles.input} file:mr-4 file:border-0 file:bg-volt-bright file:px-4 file:py-2 file:text-[12px] file:tracking-[0.1em] file:uppercase file:text-dark-bg`}
        />
        <p className={`mt-2 text-[12px] leading-[1.6] ${styles.text}`}>PDF, DOC, or DOCX. Maximum 2.5 MB.</p>
      </div>
      <SelectField
        id="careers-work-authorization"
        label="Are you legally authorized to work in the United States?"
        value={form.workAuthorization}
        onChange={(value) => update("workAuthorization", value)}
        options={["Yes", "No"]}
        tone={tone}
        required
      />
      <SelectField
        id="careers-sponsorship"
        label="Will you now or in the future require sponsorship for employment visa status?"
        value={form.sponsorshipRequirement}
        onChange={(value) => update("sponsorshipRequirement", value)}
        options={["Yes", "No"]}
        tone={tone}
        required
      />
      <input {...honeypotProps} />
      <SubmitArea tone={tone} isSubmitting={isSubmitting} status={status} buttonLabel="Submit" />
    </form>
  );
}

export function NewsletterSignupForm({ tone = "light", source = "/newsletter-signup" }: { tone?: FormTone; source?: string }) {
  const initialState = {
    firstName: "",
    lastName: "",
    email: "",
    interests: [] as string[],
  };
  const { form, update, submit, isSubmitting, status, honeypotProps } = useInquirySubmit(initialState, {
    formType: "newsletter_signup",
    formName: "Newsletter Signup",
    source,
    successMessage: "Thanks, you're on the WSC newsletter list.",
    fallbackError: "We could not sign you up right now. Please try again or email info@woodinvillesportsclub.com.",
    buildPayload: (state) => ({
      name: fullName(state),
      email: state.email,
      subject: "WSC newsletter signup",
      message: "Newsletter signup request.",
      metadata: {
        firstName: state.firstName,
        lastName: state.lastName,
        interests: Array.isArray(state.interests) ? state.interests.join(", ") : "",
        consent: "Submitted the WSC newsletter signup form.",
      },
    }),
  });

  return (
    <form onSubmit={submit} data-form-name="Newsletter Signup" className="space-y-5">
      <NameFields form={form} update={update} tone={tone} prefix="newsletter" required={false} />
      <TextField id="newsletter-email-page" label="Email" type="email" value={form.email} onChange={(value) => update("email", value)} tone={tone} required autoComplete="email" />
      <CheckboxGroupField
        id="newsletter-interests"
        label="Email lists"
        values={Array.isArray(form.interests) ? form.interests : []}
        onChange={(values) => update("interests", values)}
        options={newsletterInterests}
        tone={tone}
      />
      <input {...honeypotProps} />
      <SubmitArea tone={tone} isSubmitting={isSubmitting} status={status} buttonLabel="Sign Up" />
    </form>
  );
}

function NameFields<T extends BaseState>({
  form,
  update,
  tone,
  prefix,
  required = true,
}: {
  form: T;
  update: (key: keyof T, value: FormValue) => void;
  tone: FormTone;
  prefix: string;
  required?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <TextField
        id={`${prefix}-first-name`}
        label="First Name"
        value={fieldValue(form, "firstName")}
        onChange={(value) => update("firstName" as keyof T, value)}
        tone={tone}
        required={required}
        autoComplete="given-name"
      />
      <TextField
        id={`${prefix}-last-name`}
        label="Last Name"
        value={fieldValue(form, "lastName")}
        onChange={(value) => update("lastName" as keyof T, value)}
        tone={tone}
        required={required}
        autoComplete="family-name"
      />
    </div>
  );
}

function ContactFields<T extends BaseState>({
  form,
  update,
  tone,
  prefix,
  emailRequired = true,
  phoneRequired = false,
}: {
  form: T;
  update: (key: keyof T, value: FormValue) => void;
  tone: FormTone;
  prefix: string;
  emailRequired?: boolean;
  phoneRequired?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <TextField
        id={`${prefix}-email`}
        label="Email"
        type="email"
        value={fieldValue(form, "email")}
        onChange={(value) => update("email" as keyof T, value)}
        tone={tone}
        required={emailRequired}
        autoComplete="email"
      />
      <TextField
        id={`${prefix}-phone`}
        label="Phone"
        type="tel"
        value={fieldValue(form, "phone")}
        onChange={(value) => update("phone" as keyof T, value)}
        tone={tone}
        required={phoneRequired}
        autoComplete="tel"
        placeholder="Phone"
      />
    </div>
  );
}
