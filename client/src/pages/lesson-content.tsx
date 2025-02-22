
import { useRoute } from "wouter";
import { ContentBlocks } from "@/components/lessons/content-blocks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LessonContent() {
  const [, params] = useRoute("/lessons/:lessonId/content");
  const lessonId = params?.lessonId;

  if (!lessonId) {
    return <div>Lesson ID not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Lesson Content Blocks</CardTitle>
        </CardHeader>
        <CardContent>
          <ContentBlocks lessonId={lessonId} />
        </CardContent>
      </Card>
    </div>
  );
}
