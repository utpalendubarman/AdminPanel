import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Book, Layers, FileText, Users, GraduationCap } from "lucide-react";
import type { Course, Subject, Lesson, Teacher, User } from "@shared/schema";

export default function Dashboard() {
  const { data: courses = [] } = useQuery<Course[]>({ 
    queryKey: ["/api/list-courses"]
  });
  const { data: subjects = [] } = useQuery<Subject[]>({ 
    queryKey: ["/api/list-subjects"]
  });
  const { data: lessons = [] } = useQuery<Lesson[]>({ 
    queryKey: ["/api/list-lessons"]
  });
  const { data: teachers = [] } = useQuery<Teacher[]>({ 
    queryKey: ["/api/list-teachers"]
  });
  const { data: users = [] } = useQuery<User[]>({ 
    queryKey: ["/api/list-users"]
  });

  const stats = [
    {
      title: "Total Courses",
      value: courses.length,
      icon: Book,
      description: "Active courses in the system",
    },
    {
      title: "Total Subjects",
      value: subjects.length,
      icon: Layers,
      description: "Subjects being taught",
    },
    {
      title: "Total Lessons",
      value: lessons.length,
      icon: FileText,
      description: "Available lessons",
    },
    {
      title: "Total Teachers",
      value: teachers.length,
      icon: GraduationCap,
      description: "Registered teachers",
    },
    {
      title: "Total Users",
      value: users.length,
      icon: Users,
      description: "Registered users",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}