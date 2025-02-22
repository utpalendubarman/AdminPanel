
import { useParams } from "react-router-dom";
import { ContentBlocks } from "@/components/lessons/content-blocks";

export default function LessonContent() {
  const { lessonId } = useParams();
  
  if (!lessonId) {
    return <div>Lesson ID not found</div>;
  }

  return (
    <div className="p-6">
      <ContentBlocks lessonId={lessonId} />
    </div>
  );
}
