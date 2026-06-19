"use client";

import { useEffect } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_EDUCATION_API_URL || "https://csr.education.manjulab.com";

/** Live widget on brahmando.com/education — student / teacher / school / coaching roles. */
export function EducationPortalWidget() {
  useEffect(() => {
    const src = `${API_URL.replace(/\/$/, "")}/widget/education-portal.js`;
    if (document.querySelector(`script[src="${src}"]`)) return;

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.setAttribute("data-api-url", API_URL);
    script.setAttribute("data-actor", "student");
    script.setAttribute("data-title", "Education Portal");
    script.setAttribute("data-primary-color", "#0891b2");
    document.body.appendChild(script);

    return () => {
      script.remove();
      document.getElementById("ml-education-portal-root")?.remove();
    };
  }, []);

  return null;
}
