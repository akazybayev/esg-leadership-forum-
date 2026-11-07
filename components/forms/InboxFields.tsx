"use client";

import { useLocale } from "next-intl";
import { inboxSubject, receivedPageUrl } from "@/lib/forms/inbox";
import type { FormType } from "@/schemas/forms";

export function InboxFields({ formType }: { formType: FormType }) {
  const locale = useLocale();

  return (
    <>
      <input type="hidden" name="_subject" value={inboxSubject(formType)} />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_next" value={receivedPageUrl(locale)} />
      <input type="hidden" name="form_type" value={formType} />
      <input
        type="text"
        name="_honey"
        defaultValue=""
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
    </>
  );
}
