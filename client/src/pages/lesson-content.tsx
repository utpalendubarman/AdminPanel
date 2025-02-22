
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LessonContent() {
  const [, params] = useRoute("/lessons/:lessonId/content");
  const lessonId = params?.lessonId;

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Lesson Content</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Lesson ID: {lessonId}</p>
          {/* Add your content management UI here */}
        </CardContent>
      </Card>
    </div>
  );
}
