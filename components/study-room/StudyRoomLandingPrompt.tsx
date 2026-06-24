"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PracticeRequestPrompt } from "@/components/study-room/PracticeRequestPrompt";
import {
  isLandingPromptUsed,
  markLandingPromptUsed,
  savePracticeRequest,
  type PracticeRequest,
} from "@/lib/study-room/practiceRequest";

export function StudyRoomLandingPrompt() {
  const router = useRouter();
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    setHidden(isLandingPromptUsed());
  }, []);

  if (hidden) return null;

  const handleSubmit = (request: PracticeRequest) => {
    savePracticeRequest(request);
    markLandingPromptUsed();
    setHidden(true);
    router.push("/study-room");
  };

  return (
    <div className="mb-8">
      <PracticeRequestPrompt variant="landing" onSubmit={handleSubmit} />
    </div>
  );
}
