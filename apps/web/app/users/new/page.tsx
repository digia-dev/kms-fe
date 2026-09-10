/**
 * User form page — create or edit user.
 */

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { api, type User, type Role, type Directorate, type Team } from "@/lib/api";
import { ArrowLeft, Loader2, Save } from "lucide-react";

export default function UserFormPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id as string | undefined;
  const isEdit = Boolean(userId);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [directorates, setDirectorates] = useState<Directorate[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    status: "active",
    role_ids: [] as string[],
    team_ids: [] as string[],
    directorate_id: "",
  });

  // Load reference data
  useEffect(() => {
    Promise.all([
      api.get("/roles"),
      api.get("/directorates"),
      api.get("/teams"),
    ]).then(([r1, r2, r3]) => {
      setRoles(r1.data.data ?? []);
      setDirectorates(r2.data.data ?? []);
      setTeams(r3.data.data ?? []);
    });
  }, []);

  // Load user if editing
  useEffect(() => {
    if (!userId) return;
    api.get(`/users/${userId}`).then((res) => {
      const u = res.data.data;
      setForm({
        name: u.name,
        email: u.email,
        password: "",
        phone: u.phone ?? "",
        status: u.status,
        role_ids: u.roles?.map((r: { id: string }) => r.id) ?? [],
        team_ids: u.teams?.map((t: { id: string }) => t.id) ?? [],
        directorate_id: "",
      });
      setLoading(false);
    });
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEdit) {
        await api.put(`/users/${userId}`, {
          name: form.name,
          phone: form.phone || null,
          status: form.status,
        });
        await api.put(`/users/${userId}/roles`, { role_ids: form.role_ids });
        await api.put(`/users/${userId}/teams`, { team_ids: form.team_ids });
      } else {
        const res = await api.post("/users", {
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone || null,
          role_ids: form.role_ids,
          team_ids: form.team_ids,
        });
        const newId = res.data.data?.id;
        if (form.role_ids.length > 0 && newId) {
          await api.put(`/users/${newId}/roles`, { role_ids: form.role_ids });
        }
      }
      router.push("/users");
    } catch (err) {
      console.error("Failed to save user", err);
    } finally {
      setSaving(false);
    }
  };

  const toggleArrayItem = (arr: string[], item: string): string[] =>
    arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <a href="/users" className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? "Edit User" : "New User"}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {isEdit ? "Update user details" : "Create a new user account"}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              disabled={isEdit}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50"
            />
          </div>

          {/* Password (only for create) */}
          {!isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={8}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          )}

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+62 812-xxxx-xxxx"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* Status (only for edit) */}
          {isEdit && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          )}

          {/* Roles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Roles</label>
            <div className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setForm({ ...form, role_ids: toggleArrayItem(form.role_ids, role.id) })}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                    form.role_ids.includes(role.id)
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-gray-700 border-gray-300 hover:border-orange-300"
                  }`}
                >
                  {role.name}
                </button>
              ))}
            </div>
          </div>

          {/* Teams */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Teams</label>
            <div className="flex flex-wrap gap-2">
              {teams.map((team) => (
                <button
                  key={team.id}
                  type="button"
                  onClick={() => setForm({ ...form, team_ids: toggleArrayItem(form.team_ids, team.id) })}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                    form.team_ids.includes(team.id)
                      ? "bg-navy-900 text-white border-navy-900"
                      : "bg-white text-gray-700 border-gray-300 hover:border-navy-300"
                  }`}
                >
                  {team.name}
                </button>
              ))}
              {teams.length === 0 && (
                <p className="text-sm text-gray-400">No teams available</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <a
              href="/users"
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
            >
              Cancel
            </a>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  {isEdit ? "Update" : "Create"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
