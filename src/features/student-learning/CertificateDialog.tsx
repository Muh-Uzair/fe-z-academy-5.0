"use client";

import React, { useRef, useState } from "react";
import { Dialog as DialogPrimitive } from "radix-ui";
import { Download, X, Award, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import AppButton from "@/components/AppButton";
import { toast } from "@/components/ui/toast";
import type { IssueCourseCertificateResponseData } from "@/response-types/courseResponseTypes";

interface CertificateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certificateData: IssueCourseCertificateResponseData | null;
}

export default function CertificateDialog({
  open,
  onOpenChange,
  certificateData,
}: CertificateDialogProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  if (!certificateData) return null;

  const {
    certificateId,
    title,
    subtitle,
    studentName,
    studentEmail,
    courseTitle,
    courseLevel,
    courseDurationInMinutes,
    instructorName,
    categoryName,
    issuedAt,
    issuer,
  } = certificateData;

  const formattedDate = new Date(issuedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedDuration = (() => {
    if (!courseDurationInMinutes || courseDurationInMinutes <= 0) return null;
    if (courseDurationInMinutes < 60) {
      return `${Math.round(courseDurationInMinutes)} mins`;
    }
    const hrs = (courseDurationInMinutes / 60).toFixed(1);
    return `${hrs} hrs`;
  })();

  const handleDownloadPdf = async () => {
    if (!certificateRef.current) return;
    setIsGeneratingPdf(true);

    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const { jsPDF } = await import("jspdf");

      const element = certificateRef.current;

      const canvas = await html2canvas(element, {
        scale: 3, // High-DPI print quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");

      // Standard A4 landscape dimensions: 297mm x 210mm
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
      pdf.save(`Z-Academy-Certificate-${certificateId}.pdf`);

      toast.add({
        type: "success",
        title: "Certificate Downloaded",
        description: "Your certificate PDF has been saved successfully.",
      });
    } catch (error) {
      console.error("Failed to generate certificate PDF:", error);
      toast.add({
        type: "error",
        title: "Download Failed",
        description: "Could not generate certificate PDF. Please try again.",
      });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        {/* Fullscreen Dimmed Lightbox Overlay with Blur */}
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md duration-200 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />

        {/* Modal Content Container */}
        <DialogPrimitive.Content
          className="fixed inset-0 z-50 flex flex-col items-center justify-start sm:justify-center overflow-y-auto p-3 sm:p-6 duration-200 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
          aria-describedby="certificate-description"
        >
          {/* Top Bar with Status and Close Button */}
          <div className="w-full max-w-[940px] flex items-center justify-between mb-3 text-white">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs sm:text-sm font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Official Verified Certificate</span>
            </div>

            <DialogPrimitive.Close asChild>
              <button
                type="button"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white flex items-center justify-center transition-all border border-white/15 backdrop-blur-sm cursor-pointer shadow-lg"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </DialogPrimitive.Close>
          </div>

          <DialogPrimitive.Title className="sr-only">
            {title} - {studentName}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description id="certificate-description" className="sr-only">
            Certificate of completion awarded to {studentName} for the course {courseTitle}.
          </DialogPrimitive.Description>

          {/* Certificate Card Viewport */}
          <div className="w-full max-w-[940px] overflow-x-auto rounded-xl shadow-2xl ring-1 ring-white/20 bg-white">
            <div
              ref={certificateRef}
              className="relative w-full min-w-[760px] aspect-[1.414/1] bg-white text-neutral-900 p-6 sm:p-9 flex flex-col justify-between select-none"
              style={{
                background:
                  "radial-gradient(ellipse at center, #ffffff 50%, var(--primary-very-light, #f0fdfa) 100%)",
              }}
            >
              {/* Outer Decorative Teal Border */}
              <div
                className="absolute inset-3 sm:inset-4 pointer-events-none rounded-lg border-2 border-primary/80"
                style={{ borderColor: "var(--primary, #0f766e)" }}
              />

              {/* Inner Inset Thin Border */}
              <div
                className="absolute inset-5 sm:inset-6 pointer-events-none rounded-sm border border-primary-light/60"
                style={{ borderColor: "var(--primary-light, #99f6e4)" }}
              />

              {/* Corner Geometric Flourishes */}
              <div
                className="absolute top-4 left-4 w-7 h-7 border-t-4 border-l-4 rounded-tl pointer-events-none"
                style={{ borderColor: "var(--primary-dark, #115e59)" }}
              />
              <div
                className="absolute top-4 right-4 w-7 h-7 border-t-4 border-r-4 rounded-tr pointer-events-none"
                style={{ borderColor: "var(--primary-dark, #115e59)" }}
              />
              <div
                className="absolute bottom-4 left-4 w-7 h-7 border-b-4 border-l-4 rounded-bl pointer-events-none"
                style={{ borderColor: "var(--primary-dark, #115e59)" }}
              />
              <div
                className="absolute bottom-4 right-4 w-7 h-7 border-b-4 border-r-4 rounded-br pointer-events-none"
                style={{ borderColor: "var(--primary-dark, #115e59)" }}
              />

              {/* Watermark Crest Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none">
                <Award className="w-[380px] h-[380px] text-primary" />
              </div>

              {/* Header: Platform Branding & Certificate Title */}
              <div className="relative z-10 text-center pt-2 sm:pt-4">
                <div className="inline-flex items-center justify-center gap-2 mb-2">
                  <div
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-md text-white"
                    style={{
                      background:
                        "linear-gradient(135deg, var(--primary, #0d9488) 0%, var(--primary-dark, #115e59) 100%)",
                    }}
                  >
                    <Award className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                </div>

                <p
                  className="text-[11px] sm:text-xs font-bold tracking-[0.28em] uppercase mb-1"
                  style={{ color: "var(--primary-dark, #115e59)" }}
                >
                  {issuer || "Z-Academy Online Learning Platform"}
                </p>

                <h1
                  className="text-2xl sm:text-4xl font-extrabold tracking-wide uppercase font-serif"
                  style={{ color: "var(--primary-very-dark, #134e4a)" }}
                >
                  {title || "Certificate of Completion"}
                </h1>

                <div className="flex items-center justify-center gap-3 my-2">
                  <span
                    className="h-px w-16 sm:w-28"
                    style={{ background: "var(--primary-light, #99f6e4)" }}
                  />
                  <Sparkles
                    className="w-4 h-4"
                    style={{ color: "var(--primary, #0d9488)" }}
                  />
                  <span
                    className="h-px w-16 sm:w-28"
                    style={{ background: "var(--primary-light, #99f6e4)" }}
                  />
                </div>

                <p className="text-xs sm:text-sm text-neutral-500 italic font-serif">
                  {subtitle || "This is proudly presented to"}
                </p>
              </div>

              {/* Student Name & Achievement Section */}
              <div className="relative z-10 text-center my-auto py-2">
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900 capitalize font-serif mb-1">
                  {studentName}
                </h2>
                {studentEmail && (
                  <p className="text-xs text-neutral-400 font-mono mb-3">
                    {studentEmail}
                  </p>
                )}

                <div className="max-w-[560px] mx-auto">
                  <p className="text-xs sm:text-sm text-neutral-600 mb-2">
                    for successfully demonstrating mastery and completing all requirements for
                  </p>
                  <h3
                    className="text-xl sm:text-2xl font-bold font-heading line-clamp-2 px-4"
                    style={{ color: "var(--primary-dark, #115e59)" }}
                  >
                    {courseTitle}
                  </h3>

                  {/* Course Metadata Badges */}
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-[11px] font-medium text-neutral-600">
                    {courseLevel && (
                      <span
                        className="px-2.5 py-0.5 rounded-full capitalize"
                        style={{
                          background: "var(--primary-very-light, #f0fdfa)",
                          color: "var(--primary-dark, #115e59)",
                          border: "1px solid var(--primary-light, #99f6e4)",
                        }}
                      >
                        Level: {courseLevel}
                      </span>
                    )}
                    {categoryName && (
                      <span
                        className="px-2.5 py-0.5 rounded-full"
                        style={{
                          background: "var(--primary-very-light, #f0fdfa)",
                          color: "var(--primary-dark, #115e59)",
                          border: "1px solid var(--primary-light, #99f6e4)",
                        }}
                      >
                        Category: {categoryName}
                      </span>
                    )}
                    {formattedDuration && (
                      <span
                        className="px-2.5 py-0.5 rounded-full"
                        style={{
                          background: "var(--primary-very-light, #f0fdfa)",
                          color: "var(--primary-dark, #115e59)",
                          border: "1px solid var(--primary-light, #99f6e4)",
                        }}
                      >
                        Duration: {formattedDuration}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Signatures & Verification Seal */}
              <div className="relative z-10 grid grid-cols-3 items-end pt-4 sm:pt-6 pb-2 px-4 sm:px-8">
                {/* Left: Instructor */}
                <div className="text-center">
                  <p className="font-serif italic text-lg sm:text-xl text-neutral-800 tracking-wider">
                    {instructorName}
                  </p>
                  <div
                    className="w-32 sm:w-44 h-0.5 mx-auto my-1"
                    style={{ background: "var(--primary, #0d9488)" }}
                  />
                  <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-600">
                    Instructor
                  </p>
                </div>

                {/* Center: Official Seal */}
                <div className="flex flex-col items-center justify-center">
                  <div
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 flex flex-col items-center justify-center p-1 shadow-lg text-white relative"
                    style={{
                      borderColor: "#fbbf24", // Golden border
                      background:
                        "linear-gradient(135deg, var(--primary, #0d9488) 0%, var(--primary-dark, #115e59) 100%)",
                    }}
                  >
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-amber-300 mb-0.5" />
                    <span className="text-[8px] sm:text-[9px] font-bold tracking-widest uppercase">
                      VERIFIED
                    </span>
                    <span className="text-[7px] text-amber-200">SEAL</span>
                  </div>
                </div>

                {/* Right: Date */}
                <div className="text-center">
                  <p className="text-xs sm:text-sm font-medium text-neutral-800">
                    {formattedDate}
                  </p>
                  <div
                    className="w-32 sm:w-44 h-0.5 mx-auto my-1"
                    style={{ background: "var(--primary, #0d9488)" }}
                  />
                  <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-neutral-600">
                    Date of Issue
                  </p>
                </div>
              </div>

              {/* Bottom Security Bar */}
              <div className="relative z-10 flex items-center justify-center pt-2 border-t border-neutral-200 text-[10px] text-neutral-400 font-mono">
                <span>Verified Online Credential • Z-Academy</span>
              </div>
            </div>
          </div>

          {/* Bottom Action Controls */}
          <div className="w-full max-w-[940px] flex items-center justify-center sm:justify-end gap-3 mt-4">
            <AppButton
              variant="default"
              leftIcon={Download}
              isLoading={isGeneratingPdf}
              onClick={handleDownloadPdf}
              className="bg-primary hover:bg-primary-dark text-primary-foreground font-semibold px-6 py-2.5 shadow-lg shadow-primary/25 cursor-pointer text-sm sm:text-base"
            >
              Download PDF
            </AppButton>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
