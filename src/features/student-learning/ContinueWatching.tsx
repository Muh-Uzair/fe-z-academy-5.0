"use client";

import Image from "next/image";
import { useState } from "react";
import { PlayCircle, Clock, Award } from "lucide-react";

import AppButton from "@/components/AppButton";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AspectRatio } from "@/components/ui/aspect-ratio";

import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "@/components/PageHeader";
import AppCourseCardsGridLayout from "@/components/AppCourseCardsGridLayout";
import useClientAction from "@/hooks/useClientAction";
import { issueCourseCertificateAction } from "@/services/course/actions";
import CertificateDialog from "./CertificateDialog";
import type { Enrollment } from "@/response-types/enrollmentResponseTypes";
import type { Pagination } from "@/response-types/userResponseTypes";
import type {
  CourseListItem,
  IssueCourseCertificateResponseData,
} from "@/response-types/courseResponseTypes";

type ContinueWatchingCourse = {
  course: CourseListItem;
  enrollment: Enrollment;
};

type ContinueWatchingProps = {
  courses: ContinueWatchingCourse[];
  pagination: Pagination;
};

const ContinueWatching = ({ courses, pagination }: ContinueWatchingProps) => {
  const [activeCourseId, setActiveCourseId] = useState<string | null>(null);
  const [certificateData, setCertificateData] =
    useState<IssueCourseCertificateResponseData | null>(null);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  const { run: runIssueCertificate, isLoading: isIssuingCertificate } =
    useClientAction();

  const heroCourse =
    courses.find(({ enrollment }) => enrollment.mostRecentlySeen) ?? courses[0];
  const otherCourses = courses.filter((item) => item !== heroCourse);
  const courseHref = (courseId: string) =>
    `/course-details/${courseId}?role=student&source=enrolled`;

  const handleGetCertificate = async (courseId: string) => {
    setActiveCourseId(courseId);
    const response = await runIssueCertificate(() =>
      issueCourseCertificateAction(courseId),
    );
    console.log("Certificate action result:", response);

    if (response) {
      const data =
        (response as { data?: IssueCourseCertificateResponseData }).data ??
        (response as unknown as IssueCourseCertificateResponseData);

      if (data && data.certificateId) {
        setCertificateData(data);
        setIsCertificateOpen(true);
      }
    }
  };

  return (
    <PageFlexCol>
      <PageHeader
        pageHeading="Continue Watching"
        pageDescription="Pick up right where you left off and hit your learning goals."
      />

      {/* Hero Section */}
      {heroCourse && (
        <section className="mb-10">
          <h2 className="text-xl font-bold tracking-tight mb-4 text-foreground">
            Most recently seen
          </h2>
          <Card
            className={`overflow-hidden border-2 shadow-sm transition-all hover:shadow-md group relative ${
              heroCourse.enrollment.watchedCompletely
                ? "border-amber-400"
                : "border-border"
            }`}
          >
            <div className="flex flex-col md:flex-row">
              {/* Left side: Large Thumbnail */}
              <div className="md:w-5/12 lg:w-4/12 relative overflow-hidden">
                <AspectRatio ratio={16 / 9} className="md:h-full">
                  <Image
                    src={heroCourse.course.thumbnailUrl}
                    alt={heroCourse.course.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 transition-colors group-hover:bg-black/10" />
                </AspectRatio>
              </div>

              {/* Right side: Content */}
              <div className="flex flex-col flex-1 p-6 md:p-8 justify-center bg-card">
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium mb-3">
                  <Clock className="h-4 w-4" />
                  <span>Most recently seen</span>
                </div>

                <h3 className="text-2xl md:text-3xl font-bold mb-2 line-clamp-2">
                  {heroCourse.course.title}
                </h3>

                <p className="text-muted-foreground mb-6">
                  Instructor:{" "}
                  <span className="font-medium text-foreground">
                    {heroCourse.course.instructorDetails.fullName}
                  </span>
                </p>

                <div className="mt-auto space-y-4">
                  <div className="flex justify-between items-end mb-2">
                    <div className="text-right ml-auto">
                      <span className="text-2xl font-bold text-primary">
                        {heroCourse.enrollment.watchPercentage}%
                      </span>
                      <p className="text-xs text-muted-foreground font-medium">
                        Complete
                      </p>
                    </div>
                  </div>

                  <Progress
                    value={heroCourse.enrollment.watchPercentage}
                    className="h-2.5 bg-primary/10"
                  />

                  <div className="flex items-center justify-between pt-4">
                    <span className="text-sm text-muted-foreground font-medium flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      {heroCourse.enrollment.totalDurationWatchedInMinutes}m /{" "}
                      {heroCourse.course.totalDurationInMinutes}m watched
                    </span>

                    <div className="flex items-center gap-2">
                      {heroCourse.enrollment.watchedCompletely && (
                        <AppButton
                          leftIcon={Award}
                          isLoading={
                            isIssuingCertificate &&
                            activeCourseId === heroCourse.course._id
                          }
                          className="bg-amber-400 text-black hover:bg-amber-400/90 dark:bg-amber-400 dark:text-black dark:hover:bg-amber-400/90 font-semibold shadow-sm border border-amber-400"
                          onClick={() =>
                            handleGetCertificate(heroCourse.course._id)
                          }
                        >
                          Get Certificate
                        </AppButton>
                      )}
                      <AppButton
                        href={courseHref(heroCourse.course._id)}
                        leftIcon={PlayCircle}
                      >
                        Resume Course
                      </AppButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* Grid of Other Courses */}
      {otherCourses.length > 0 && (
        <section>
          <h2 className="text-xl font-bold tracking-tight mb-4 text-foreground">
            In Progress
          </h2>
          <AppCourseCardsGridLayout
            courses={otherCourses.map(({ course, enrollment }) => ({
              ...course,
              totalDurationWatchedInMinutes:
                enrollment.totalDurationWatchedInMinutes,
              watchedCompletely: enrollment.watchedCompletely,
            }))}
            mode="in-progress"
            renderFooter={(course) => (
              <div className="flex items-center gap-2">
                {course.watchedCompletely && (
                  <AppButton
                    leftIcon={Award}
                    isLoading={
                      isIssuingCertificate && activeCourseId === course._id
                    }
                    className="flex-1 bg-amber-400 text-black hover:bg-amber-400/90 dark:bg-amber-400 dark:text-black dark:hover:bg-amber-400/90 font-semibold shadow-sm border border-amber-400"
                    onClick={() => handleGetCertificate(course._id)}
                  >
                    Get Certificate
                  </AppButton>
                )}
                <AppButton
                  href={courseHref(course._id)}
                  className={course.watchedCompletely ? "flex-1" : "w-full"}
                >
                  Resume
                </AppButton>
              </div>
            )}
            pagination={true}
            paginationMeta={pagination}
          />
        </section>
      )}

      {/* Certificate Lightbox Dialog */}
      <CertificateDialog
        open={isCertificateOpen}
        onOpenChange={setIsCertificateOpen}
        certificateData={certificateData}
      />
    </PageFlexCol>
  );
};

export default ContinueWatching;
