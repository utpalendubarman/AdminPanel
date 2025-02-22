import { AdminProfile } from "@/components/admin/admin-profile";

export default function AdminProfilePage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Admin Profile</h1>
        <p className="text-muted-foreground mt-1">
          Manage your profile settings and preferences
        </p>
      </div>
      
      <AdminProfile />
    </div>
  );
}
