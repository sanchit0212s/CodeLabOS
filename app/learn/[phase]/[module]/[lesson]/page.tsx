import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { allLessons, findLesson, getNextLesson, getPrevLesson } from "@/content/curriculum";
import { lessonRegistry, lessonKey } from "@/content/lessons/registry";
import { LessonChrome } from "@/components/lesson/LessonChrome";

interface PageProps {
  params: { phase: string; module: string; lesson: string };
}

export function generateStaticParams() {
  return allLessons.map((l) => ({
    phase: l.phaseId,
    module: l.moduleId,
    lesson: l.slug,
  }));
}

export function generateMetadata({ params }: PageProps) {
  const lesson = findLesson(params.phase, params.module, params.lesson);
  return { title: lesson ? `${lesson.title} — CodeLabOS` : "Lesson — CodeLabOS" };
}

export default function LessonPage({ params }: PageProps) {
  const lesson = findLesson(params.phase, params.module, params.lesson);
  if (!lesson) return notFound();

  const key = lessonKey(params.phase, params.module, params.lesson);
  const loader = lessonRegistry[key];
  const prev = getPrevLesson(lesson.n);
  const next = getNextLesson(lesson.n);

  if (!loader) {
    return (
      <LessonChrome lesson={lesson} prev={prev} next={next}>
        <ComingSoon />
      </LessonChrome>
    );
  }

  const LessonBody = dynamic(loader, {
    loading: () => (
      <div className="text-ink-mute font-mono text-[12px]">loading lesson…</div>
    ),
  });

  return (
    <LessonChrome lesson={lesson} prev={prev} next={next}>
      <LessonBody />
    </LessonChrome>
  );
}

function ComingSoon() {
  return (
    <div className="panel rounded-sm p-8 text-center">
      <div className="marker mb-3">status</div>
      <h2 className="text-xl font-semibold text-ink mb-2">Lesson not authored yet</h2>
      <p className="text-ink-dim max-w-prose mx-auto leading-relaxed">
        This lesson is mapped in the curriculum but its content hasn't been
        written yet. Phase 0 is fully authored; later phases are being
        built phase by phase following the same template.
      </p>
    </div>
  );
}
