import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { LayoutShell } from "@/components/layout-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";

export default function ProfilePage() {
  const { user, refetchUser } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: {
      username?: string;
      email?: string;
      password?: string;
    }) => {
      const response = await fetch(api.auth.profile.path, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Update failed");
      }

      return response.json();
    },
    onSuccess: () => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      refetchUser();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updates: any = {};

    // Validate and add username
    if (username !== user?.username) {
      if (!username.trim()) {
        alert("Username cannot be empty");
        return;
      }
      updates.username = username;
    }

    // Validate and add email
    if (email !== user?.email) {
      if (!email.trim()) {
        alert("Email cannot be empty");
        return;
      }
      if (!email.includes("@")) {
        alert("Please enter a valid email");
        return;
      }
      updates.email = email;
    }

    // Validate and add password if changing
    if (newPassword || currentPassword) {
      if (!newPassword) {
        alert("Please enter a new password");
        return;
      }

      if (newPassword.length < 6) {
        alert("Password must be at least 6 characters");
        return;
      }

      if (newPassword !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      updates.password = newPassword;
    }

    if (Object.keys(updates).length === 0) {
      alert("No changes to update");
      return;
    }

    updateProfileMutation.mutate(updates);
  };

  return (
    <LayoutShell title="Edit Profile">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update your username and email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {updateProfileMutation.isError && (
                <Alert variant="destructive">
                  <AlertDescription>
                    {updateProfileMutation.error instanceof Error
                      ? updateProfileMutation.error.message
                      : "An error occurred"}
                  </AlertDescription>
                </Alert>
              )}

              {updateProfileMutation.isSuccess && (
                <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    Profile updated successfully
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={updateProfileMutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={updateProfileMutation.isPending}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password for security
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  placeholder="Leave empty if not changing"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={updateProfileMutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={updateProfileMutation.isPending}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={updateProfileMutation.isPending}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </LayoutShell>
  );
}
