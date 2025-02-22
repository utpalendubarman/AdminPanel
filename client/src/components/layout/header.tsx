import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Bell, Settings } from "lucide-react";

export function Header() {
  const { toast } = useToast();

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="ml-auto flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              toast({
                title: "Notifications",
                description: "No new notifications",
              });
            }}
          >
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
