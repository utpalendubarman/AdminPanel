import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Courses from "@/pages/courses";
import Subjects from "@/pages/subjects";
import Lessons from "@/pages/lessons";
import Teachers from "@/pages/teachers";
import Users from "@/pages/users";
import Conversations from "@/pages/conversations";
import AdminProfile from "@/pages/admin-profile";
import LessonContent from "@/pages/lesson-content"; // Import added here

function Router() {
  return (
    <div className="flex h-screen">
      <Sidebar className="w-64 hidden md:block" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/courses" component={Courses} />
            <Route path="/subjects" component={Subjects} />
            <Route path="/lessons" component={Lessons} />
            <Route path="/lessons/:lessonId/content" component={LessonContent} /> {/* Added route */}
            <Route path="/teachers" component={Teachers} />
            <Route path="/users" component={Users} />
            <Route path="/conversations" component={Conversations} />
            <Route path="/admin-profile" component={AdminProfile} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;